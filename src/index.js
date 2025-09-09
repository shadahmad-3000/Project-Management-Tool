const app = require("./app");
const { dbConnect } = require("./utils/dbconnect");
const config = require("./utils/config");
const port = config?.PORT || 5000;

app.listen(port, async () => {
    try {
        console.log(`Server is running at ${port}`);
        await dbConnect();
    } catch (error) {
        console.error("Error in running Server");
    }
})
