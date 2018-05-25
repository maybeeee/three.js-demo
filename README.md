1. 在官网下载系统对应的Node.js与MongoDB安装包并安装。


2. 打开命令行工具，运行MongoDB：mongod --dbpath [电脑上的数据库文件夹的路径名]。


3. 新开一个命令行工具，安装项目依赖：切换到项目根目录，执行命令“npm install”。。
4. 随后切换到seeds目录下，将数据写入数据库：执行命令“node product.js”。
5. 最后，在项目根目录下执行“node app.js”。命令行工具窗口提示项目运行成功后，在浏览器地址栏输入：localhost：3000。
6. 以后每次启动项目只需执行2、4两步即可。

![three](three.png)