# Some ground rules
1. Add both node_modules from Slient and Server to your `gitignore` file
2. For any functionality make a brach with the prefix of your name `Name-<some branch name>` use this namign convention

## `frontend`
- Use React Js
- Use vite as the node manger
```
    npm install express cors react-router-dom lucid-react
```
3. To start the server, cd into the dir and then type command `npm run dev`

## `backend`
1. Install the needed lib with the command bellow
```  bash
    npm install express mysql2 dotenv cors
```
2. make sure in the `package.json` file type is set to module, if it's not there, add it!
```json
    {
        ...,
        "type": "module"
    }
```
3. To start the server, cd into the dir and then type command `npm run start`

### Database
- Use only mySQL database

