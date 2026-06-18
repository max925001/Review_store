import bcrypt from 'bcrypt';
import prisma from '../src/config/prisma.js';

async function runTest() {
  console.log('--- STARTING RATINGS INTEGRATION TEST ---');
  let testUser = null;
  let testOwner = null;
  let testStore = null;
  let testRating = null;

  try {
    const passwordHash = await bcrypt.hash('TestPassword123!', 10);
    
    // 1. Create a normal user
    console.log('1. Creating test user...');
    testUser = await prisma.user.create({
      data: {
        name: 'Test Reviewer',
        email: 'test_reviewer_integration@example.com',
        password: passwordHash,
        role: 'USER',
        address: '123 Reviewer St'
      }
    });
    console.log('User created:', testUser.id);

    // 2. Create a store owner user & employee link
    console.log('2. Creating test store owner user...');
    testOwner = await prisma.user.create({
      data: {
        name: 'Test Owner',
        email: 'test_owner_integration@example.com',
        password: passwordHash,
        role: 'STORE_OWNER',
        address: '456 Owner Rd'
      }
    });

    // 3. Create a store
    console.log('3. Creating test store...');
    testStore = await prisma.store.create({
      data: {
        name: 'Test Shop LLC',
        email: 'test_shop_integration@example.com',
        address: '789 Shop Blvd',
        createdBy: testUser.id // Created by user (as a fallback)
      }
    });

    // Associate owner user with the store
    await prisma.employee.create({
      data: {
        userId: testOwner.id,
        name: testOwner.name,
        email: testOwner.email,
        password: passwordHash,
        role: 'OWNER',
        storeId: testStore.id
      }
    });
    console.log('Store created:', testStore.id, 'with Owner:', testOwner.id);

    // 4. Test Case A: Submitting a valid rating as USER
    console.log('\nTest Case A: Normal user submits a 4.0 star review...');
    // We will call the controller logic directly or perform the service call
    // Let's import the service dynamically
    const storeService = await import('../src/modules/stores/store.service.js');
    
    testRating = await storeService.createStoreRating(testStore.id, testUser.id, {
      rating: 4.0,
      comment: 'Pretty good store!'
    });
    console.log('Rating created successfully:', testRating.id);

    // Check store updates
    const updatedStore = await prisma.store.findUnique({
      where: { id: testStore.id }
    });
    console.log('Updated Store stats - totalReviewUser:', updatedStore.totalReviewUser, 'avgrating:', Number(updatedStore.avgrating));
    if (updatedStore.totalReviewUser !== 1 || Number(updatedStore.avgrating) !== 4.0) {
      throw new Error('Test Case A Failed: Store metrics did not update correctly');
    }
    console.log('Test Case A PASSED!');

    // 5. Test Case B: Attempt to submit a second rating for the same store
    console.log('\nTest Case B: User attempts to review the same store again...');
    try {
      await storeService.createStoreRating(testStore.id, testUser.id, {
        rating: 5.0,
        comment: 'Trying to cheat rating!'
      });
      throw new Error('Test Case B Failed: Duplicate rating was not blocked!');
    } catch (err) {
      console.log('Duplicate rating correctly blocked with error:', err.message);
      if (err.message.includes('already reviewed')) {
        console.log('Test Case B PASSED!');
      } else {
        throw err;
      }
    }

    // 6. Test Case C: Store owner attempts to rate their own store
    console.log('\nTest Case C: Owner attempts to review their own store...');
    try {
      await storeService.createStoreRating(testStore.id, testOwner.id, {
        rating: 5.0,
        comment: 'Self promotion review!'
      });
      throw new Error('Test Case C Failed: Owner rating own store was not blocked!');
    } catch (err) {
      console.log('Self-rating correctly blocked with error:', err.message);
      if (err.message.includes('owners and employees cannot submit')) {
        console.log('Test Case C PASSED!');
      } else {
        throw err;
      }
    }

  } catch (error) {
    console.error('\nINTEGRATION TEST FAILED:', error);
  } finally {
    console.log('\n--- CLEANING UP TEST DATA ---');
    if (testRating) {
      await prisma.rating.deleteMany({
        where: { storeId: testStore.id }
      }).catch(console.error);
    }
    if (testStore) {
      await prisma.employee.deleteMany({
        where: { storeId: testStore.id }
      }).catch(console.error);
      await prisma.store.delete({
        where: { id: testStore.id }
      }).catch(console.error);
    }
    if (testUser) {
      await prisma.user.delete({
        where: { id: testUser.id }
      }).catch(console.error);
    }
    if (testOwner) {
      await prisma.user.delete({
        where: { id: testOwner.id }
      }).catch(console.error);
    }
    console.log('Cleanup finished. Closing database pool.');
    await prisma.$disconnect();
    console.log('Disconnected Prisma.');
  }
}

runTest();
