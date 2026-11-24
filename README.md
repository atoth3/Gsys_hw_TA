- I'm using DataTestIDs but lot of people recommend getByRole and filter to text because it is more robust against code change. But if we generate testIDs automaticall it should be the fastest way to find an element.
- In the checkout process the cart item test ID is inventory-item but the class is cart_item. Why it is differ if everywhere else same
- Opening the /inventory page throw an login error immidiatelly

Case 1 – Automate Purchase Process

Open the url XXX
2. Create a credential.json file in test/resources folder and store:
{
username: xxx,
password: xxx
}
3. Parse the credentials from credential.json and use it for the following test
4. On the website type username and password and click on login button
5. Add the following items to the cart: Sauce Labs Backpack, Sauce Labs Fleece Jacket
6. Validate the number on the cart symbol
7. Go through the checkout process
8. Validate that Thank you for your order message is appearing