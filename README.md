# tca-Alfred

Here's the steps to run the application

1. Install Node and NPM
2. Install & Run MongoDB
3. Create a Database in MongoDB:    tca_db
4. Replace the "json_file_path" in api/common/config.js with the actual file path of the json file. This should be absolute path.
5. Install Node Modules
Go to the project directory and install node modules.
npm install
6. Install Bower modules
Go to project directory and install bower modules.
bower install
note: bower install as root
7. Test Run the Project
npm start


For the live deployment to the server, you should follow guide lines.
https://www.terlici.com/2015/04/20/hosting-deploying-nodejs-centos.html
https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-centos-7



When there's an code update,
1. Update the code. You can pull from git.
2. Take Step 5 to Step 7 again.

#Encrypt Json file

node encrypt.js [realive path of json] [path of new encrypted json file]

## Todo
1. Log in fix 
2. Added display name
3. Help view smaller with the login as
4. Double click into the help view
5. Double click for agragation 
6. Get rid of icons
7. Make config column size dynamic 
	* Check for the width of the largest item then add a couple charcters and make all of the collumns uniform
8. Get rid of header and footer and copy the footer off the qb site
9. Add viewer panel 
10. Add option for admin user
11. Display names