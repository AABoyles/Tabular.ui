#!/usr/bin/python
import time, sqlite3, sys, urllib, csv

begin = time.time()

url = "http://www.correlatesofwar.org/COW2%20Data/SystemMembership/2011/states2011.csv"

print "Downloading from", url
response = urllib.urlretrieve(url, '../Data/states2011.csv')

print "Opening Database"
con = sqlite3.connect('../Data/PyRBD.db')
cur = con.cursor()

rows = 0

with open(response[0], 'Ur') as csvFile:
    reader = csv.reader(csvFile)
    query = "INSERT INTO stateMembership("
    for row in reader:
        if rows == 0:
            headers = ",".join(row)
            query += headers + ") VALUES "
            cur.execute("create table if not exists stateMembership(" + headers + ");")
        else:
            query += "(\"" + "\",\"".join(row) + "\"),"
            cur.execute("INSERT INTO stateMembership(" + headers + ") VALUES (\"" + "\",\"".join(row) + "\");")
        rows += 1
        if rows % 1000 == 0:
            
            query = "INSERT INTO stateMembership("
        if rows % 10000 == 0:
            print rows, "rows processed."
            con.commit()
    con.commit()
con.close()
end = time.time()
print rows, "rows processed in", end - begin, "seconds"
sys.exit()
