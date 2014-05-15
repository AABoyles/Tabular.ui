#!/usr/bin/python
import time, sqlite3, sys, urllib, csv
begin = time.time()

tablename = "InterstateWars"
url = "http://www.correlatesofwar.org/COW2%20Data/WarData_NEW/Inter-StateWarData_v4.0.csv"

tree = url.split("/")
filename = tree[len(tree)-1]
response = urllib.urlretrieve(url, '../Data/' + filename)

con = sqlite3.connect('../Data/PyRBD.db')
cur = con.cursor()

rows = 0

with open(response[0], 'Ur') as csvFile:
    reader = csv.reader(csvFile)
    for row in reader:
        if rows == 0:
            headers = ",".join(row)
            cur.execute("create table if not exists " + tablename + "(" + headers + ");")
        else:
            cur.execute("INSERT INTO " + tablename + "(" + headers + ") VALUES (\"" + "\",\"".join(row) + "\");")
        rows += 1
        if rows % 10000 == 0:
            con.commit()
    con.commit()
con.close()
end = time.time()
print rows, "rows processed in", end - begin, "seconds"
sys.exit()
