#!/usr/bin/python
import time, sqlite3, sys, urllib, csv
begin = time.time()

tablename = "IntrastateWars"
url = "http://www.correlatesofwar.org/COW2%20Data/WarData_NEW/Intra-StateWarData_v4.1.csv"

tree = url.split("/")
filename = tree[len(tree)-1]
response = urllib.urlretrieve(url, '../Data/' + filename)

con = sqlite3.connect('../Data/PyRBD.db')
cur = con.cursor()

with open(response[0], 'Ur') as csvFile:
    rows = 0
    reader = csv.reader(csvFile)
    for row in reader:
        query = ""
        if rows == 0:
            headers = ",".join(row)
            query = "create table if not exists " + tablename + "(" + headers + ");"
        else:
            query = "INSERT INTO " + tablename + "(" + headers + ") VALUES (\"" + "\",\"".join(row) + "\");"
        cur.execute(query)
        rows += 1
        if rows % 10000 == 0:
            con.commit()
    con.commit()
con.close()
end = time.time()
print rows, "rows processed in", end - begin, "seconds"
sys.exit()
