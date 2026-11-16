```bash
# 全局设置：以后新建仓库默认分支就是 main（只执行一次）
git config --global init.defaultBranch main

########## 1、新建分支 ##########

# 新建分支 brancd_b
# -c = create 之后切换到新的分支
git switch -c brancd_b

# 新分支 push 到远程仓库
git push -u origin brancd_b


########## 2、某分支代码合并到 main 分支 ##########

# 切换到 main 分支
git switch main

# 拉取远程仓库 main 分支的最新代码
git pull origin main

# 把 brancd_b 的代码合并进去
git merge brancd_b

# main 分支推送到远程仓库
git push origin main

########## 3、删除分支 ##########

# 删除一个分支（必须先切到别的分支，不能删除所在的分支）
git branch -d brancd_a

# 远程仓库同步删除
git push origin --delete brancd_a

# 清理本地已经不存在的远程分支记录
git fetch --prune

########## 4、打附注标签（annotated tag） ##########
# 先保证代码提交完毕
$ git status
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean

# 打附注标签（不加 -a 是打轻量标签 lightweight tag）
$ git tag -a milestone/M1 -m "里程碑M1：用户模块开发完成，阶段快照"
```