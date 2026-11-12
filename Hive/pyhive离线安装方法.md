# PyHive 离线安装方法

Windows x64 + Python 3.13

## 一、需要装哪些包（按 HiveServer2 认证方式选）

| 认证方式 | 需要的包 | 说明 |
| --- | --- | --- |
| NONE | `pyhive` + `thrift` + `thrift-sasl` | 最简单，通常足够 |
| LDAP | `pyhive` + `thrift` + `pure-sasl` | 用纯 Python 的 `pure-sasl` |
| Kerberos/GSSAPI | `pyhive` + `thrift` + `thrift-sasl`+`pure-sasl` | 一般用不到 |

注意：
- **不要**用 `pip install "pyhive[hive]"`，该 extras 会拉需要 C 编译的 `sasl`，Windows 上很难装。

## 二、常见坑

1. **`thrift`、`pyhive` 只有源码包(sdist)、没有 wheel**。
   下载时**不要**加 `--only-binary=:all:`，否则这些包会报「no matching distribution」。
2. **离线安装 sdist 会触发「构建隔离(build isolation)」**，隔离环境需要 `setuptools>=40.8.0`/`wheel`；
   若离线包目录里没有它们，就会报：
   `No matching distribution found for setuptools>=40.8.0`。
   → 见第四节解决方案。
3. 没有认证方式（NONE）时，也需要安装 thrift-sasl，否则报错 `ModuleNotFoundError: No module named 'thrift_sasl'`

## 三、本地下载依赖包（拷入内网用）

本地与内网同为 Windows x64 + Python 3.13，直接下载即可（不加平台/only-binary 限制，让 pip 自动抓 wheel + sdist）：

```powershell
pip download pyhive thrift pure-sasl thrift-sasl -d pkgs

# 建议连同构建工具一起打包，内网离线更稳（对应第四节方案 B）
pip download setuptools wheel -d pkgs
```

把整个 `pkgs` 目录拷入内网。

## 四、内网离线安装（两种方案，任选其一）

### 方案 A（推荐，最简单）：关闭构建隔离，复用当前环境的 setuptools/wheel

conda 的 base 环境一般自带 `setuptools`/`wheel`，加 `--no-build-isolation` 就能就地编译：

```powershell
D:\apps\miniconda3\python.exe -m pip install --no-index --find-links=pkgs --no-build-isolation pyhive thrift pure-sasl thrift-sasl
```

### 方案 B：把构建工具一起放进离线包目录，保持默认隔离

前提是第三节已把 `setuptools`、`wheel` 的包下载到 `pkgs` 里：

```powershell
D:\apps\miniconda3\python.exe -m pip install --no-index --find-links=pkgs pyhive thrift pure-sasl thrift-sasl
```

## 五、验证安装

```powershell
D:\apps\miniconda3\python.exe -c "from pyhive import hive; import thrift; print('pyhive OK')"
```

## 六、连接示例（供参考，替换为实际连接信息）

```python
from pyhive import hive

conn = hive.Connection(
    host="<hiveserver2_host>",
    port=10000,
    database="<db_name>",
    auth="NONE",          # 或 "LDAP"（LDAP 需已装 pure-sasl）
    # username / password 视认证方式而定
)
cur = conn.cursor()
# 执行 DDL 时按分号拆成单条语句逐条 execute（HiveServer2 一次通常执行一条）
cur.execute("CREATE TABLE ...")
cur.close()
conn.close()
```

## 七、实测可用的执行命令（CDH 6.3.0，无认证服务端）

内网 `hive.server2.authentication=NONE` 仍走 SASL 传输，故用 `--auth NONE` 并配 `--username`（对应 beeline 只给 `-n hive`、URL 不带 `;auth=noSasl`）。

对应 beeline：

```bash
beeline \
-n hive \
-u jdbc:hive2://afp-dev-bigdata1:10000 \
--showDbInPrompt=true \
--hiveconf hive.resultset.use.unique.column.names=false \
--hiveconf hive.exec.mode.local.auto=true \
--hiveconf hive.cli.print.header=true \
--hiveconf mapreduce.map.memory.mb=4096 \
--hiveconf mapreduce.reduce.memory.mb=4096
```

已验证可成功执行 DDL：
说明 \` 在Windows PowerShell 中标记换行，相当于 Linux Shell 中的 \，但要求 \` 之后下一行开头没有空格。

```powershell
D:\apps\miniconda3\python.exe `
D:\code\python-project\Scripts\run_hive_sql.py `
D:\code\python-project\Scripts\output\ddl.txt `
--host 10.55.157.128 `
--port 10000 `
--database afp_tmp `
--auth NONE `
--username hive
```

要点：
- `--auth NONE` 需已装 `thrift-sasl` + `pure-sasl`，否则报 `ModuleNotFoundError: No module named 'thrift_sasl'`。
- 不要改用 `--auth NOSASL`：服务端要求 SASL 握手时，NOSASL 会在 OpenSession 处报 thrift `Length exceeded max allowed`。

## 八、要点速记

- 缺 wheel 的包（thrift/pyhive）：下载时别用 `--only-binary=:all:`。
- 离线装 sdist 卡在 `setuptools>=40.8.0`：用 `--no-build-isolation`（方案 A），
  或把 `setuptools`/`wheel` 一并打包（方案 B）。
- 只装认证方式真正需要的包，普通场景不必装 `thrift-sasl`。
