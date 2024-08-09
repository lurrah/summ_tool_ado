// Database Connection
const { connectDB, closeDB} = require('../backend/db_connections.js');

describe('Database Connection', () => {
    test('connects to the database successfully', async () => {
        await expect(connectDB()).resolves.toBe('Database Connected')
    });
    test('closes the database successfully', async () => {
        await expect(closeDB()).resolves.toBe('Database Closed');
    })
})

// OpenAi Connection
//const { getAIres, checkWorkItems, getWorkItems, getItemList } = require('../middleware/ado_comms.js');
const { respModel } = require('../backend/db_models.js');
const { getAIres } = require('../backend/ai_func.js');


describe('OpenAI called when necessary', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('if itemlist is empty, request is not sent', async () => {
        // Mock Express response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const result = await getAIres('', '');

        expect(result.content).toEqual('No workitems found.');
    }); 
})



// global.fetch = jest.fn().mockResolvedValue({
//     okay: true,
//     json: async () => ({ 'workItemRelations': [] })
// });
// jest.mock('../middleware/ado_comms', () => {
//     const originalModule = jest.requireActual('../middleware/ado_comms');
//     return {
//       ...originalModule,
//       getItemList: jest.fn().mockResolvedValue({ 'workItemRelations': [] })
//     };
//   });
//     describe('getWorkItems does not create a database entry if there is no workitems', () => {
//     it('should return null if no work items are found', async () => {
//         req = { headers: { id: '123', team: 'team' } };
//         res = {};

//         const result = await getWorkItems(req, res);
//         expect(result).toBeNull();
//     });
// });
