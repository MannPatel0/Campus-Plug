# Campus-Plug
The ultimate plug for student deals

## some ground rules
1. Add both node_modules from client and server to your `gitignore` file
2. Do not use `.ENV` variables
3. For any functionality make a brach with the prefix of your name `Name-<some branch name>` use this namign convention 
4. For all method added a comment as to how, why, what it does


## Client
- Use React Js
- Use vite as the node manger
## Server
1. Install the needed lib with the command bellow
```  bash
    npm install express mysql2 dotenv cors
```
2. make sure in the `package.json` file type is set to module, if it not there add it. 
```json
    {
        ...,
        "type": "module" 
    }
```

## Database
- Use only SQL database
- Loading of initian database will be done