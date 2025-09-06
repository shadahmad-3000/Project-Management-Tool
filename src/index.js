const app = require("./app");
const dotenv = require("dotenv");
const { dbConnect } = require("./utils/dbconnect");
dotenv.config();

const port = process.env.PORT || 5000;

app.listen(port, async () => {
    try {
        console.log(`Server is running at ${port}`);
        await dbConnect();
    } catch (error) {
        console.error("Error in running Server");
    }
})
