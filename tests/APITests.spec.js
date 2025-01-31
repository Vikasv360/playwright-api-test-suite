const { test, expect } = require('@playwright/test');

var userToken;
var bookId;
var orderId;
const customerName = "vikasv386";
const customerEmail = "vikasv386@example.com";

test.beforeAll('POST : Customer Authorization', async ({ request }) => {

    const authorizationToken = await request.post('https://simple-books-api.glitch.me/api-clients/',
        {
            data: {
                "clientName": customerName,
                "clientEmail": customerEmail
            },
            headers: {
                "Accept": "application/json"
            }
        }
    );

    console.log(await authorizationToken.json());

    expect(await authorizationToken.status()).toBe(201);
    var token = await authorizationToken.json();
    userToken = token.accessToken;

    console.log(token.accessToken);
});

test('GET : get the list of all the book', async ({ request }) => {

    const getBooksresponse = await request.get('https://simple-books-api.glitch.me/books');
    console.log(await getBooksresponse.json());
    expect(getBooksresponse.status()).toBe(200);
    const bookIdArray = await getBooksresponse.body();
    const jsonResponse = JSON.parse(bookIdArray.toString());

    var bookIds = jsonResponse.find(book => book.id === 3);

    bookId = bookIds.id;

});


test('POST : Submit the order', async ({ request }) => {
    const submitOrderResponse = await request.post('https://simple-books-api.glitch.me/orders',
        {
            data: {
                "bookId": bookId,
                "customerName": customerName
            },
            headers: {
                "Accept": "application/json",
                "Authorization": userToken
            }
        }
    );

    console.log(await submitOrderResponse.json())
    var SubmitResponse = await submitOrderResponse.json();
    var OrderId = SubmitResponse.orderId;

    orderId = OrderId;
    expect(orderId).toBeDefined();

});

test('GET : get the submitted order ID', async ({ request }) => {

    const GetOrderResponse = await request.get(`https://simple-books-api.glitch.me/orders/${orderId}`, {
        headers: {
            "Authorization": userToken
        }
    });

    const getOrderResponseBody = await GetOrderResponse.json();
    console.log(getOrderResponseBody);
    var extractedCustName = getOrderResponseBody.customerName;
    console.log(extractedCustName);
    expect(extractedCustName).toBe(customerName);

});

test('GET : get all the orders submitted by the customer', async ({ request }) => {

    const allordersResponse = await request.get('https://simple-books-api.glitch.me/orders',
        {
            headers: {
                "Authorization": userToken
            }
        }
    );

    console.log(await allordersResponse.json());

});


test('DELETE: delete the submitted order',async ({request})=>{

    const deleteResponse = await request.delete(`https://simple-books-api.glitch.me/orders/${orderId}`, {
        headers: {
            "Authorization": userToken
        }
    });

    if (deleteResponse.status() === 204) {
        console.log("Order deleted successfully");
    } else {
        try {
            const resDelete = await deleteResponse.json();
            console.log(resDelete);
        } catch (error) {

            console.log("No content to parse, deletion successful.");
        }
    }

});
