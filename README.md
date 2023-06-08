# 预安装

1. 安装好 Node.js 环境
2. 安装好 Docker 环境，并确保有 docker-compose
3. 安装好 python3 的环境，并安装 scrapy 框架，`pip install scrapy`安装到全局环境(或可使用 python virual environment)
4. 用 Node.js 的 npm 安装 pnpm，`npm install -g pnpm`安装到全局

> 最好可以使用 linux 环境配置安装，windows 环境配置起来比较繁琐

> 如果使用了 windows 系统，需要修改`kg/packages/backend/src/query.ts`中的 22 行文件位置，修改成 windows 中的一个文件位置，如`C://query.csv`，并修改`kg/packages/backend/query_kg/baike/spiders/baike.py`中 19 行的文件位置和前面保持一致

# 依赖库安装和数据库环境启动

1. 切换到`kg/`目录下，运行`pnpm install`递归安装整个**pnpm workspace**的依赖库，包括前端和后端程序
2. 切换到`kg/packages/backend`目录下，运行`docker-compose up -d`启动数据库服务并让其后台运行
3. 登陆`http://localhost:7474`修改 Neo4j 默认密码，默认密码为`neo4j`，将密码修改为`neo4jDatabase`

# 启动前后端服务

1. 切换到`kg/packages/backend`目录下，运行`pnpm run dev`或`pnpm run start`运行后端服务
2. 切换到`kg/packages/ui`目录下，运行`pnpm run dev`运行前端服务

# 访问页面

浏览器进入`http://localhost:5173`页面
