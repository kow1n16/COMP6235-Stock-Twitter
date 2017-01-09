# SELECT retweets,times,pos,neg,bias
# FROM tweets_clone
# INTO OUTFILE '/home/su/orders.csv'
# FIELDS TERMINATED BY ','
# ENCLOSED BY '"'
# LINES TERMINATED BY '\n';

# SELECT id,name,location
# FROM employees
# INTO OUTFILE '/var/lib/mysql-files/orders.csv'
# FIELDS TERMINATED BY ','
# ENCLOSED BY '"'
# LINES TERMINATED BY '\n';

import csv

# f = open('sbux_original.csv')
# csv_f = csv.reader(f)

# for row in csv_f:
# 	if(row[0][0] == 'a'):
# 		timestamp = row[0][1::]
# 		row[0] = timestamp
# 	else:
# 		print row
# 		time_stamp = int(timestamp) + 300 * int(row[0])
# 		print time_stamp
# 		row[0] = time_stamp
# 	# write row to a new csv file. 
# 	with open('sbux.csv', 'ab') as f:                                    
# 	    writer = csv.writer(f)                                                       
# 	    writer.writerow(row)


hostname = 'svm-js1n16-COMP6235-temp.ecs.soton.ac.uk'
username = 'test'
password = 'test'
database = 'senti'

# Simple routine to run a query on a database and print the results:
def doQuery( conn ) :
    cur = conn.cursor()

    cur.execute( "SELECT retweets,times,pos,neg,bias FROM tweets_clone LIMIT 5" )

	# write row to new csv file. 
	# with open('test_tweets.csv', 'ab') as f:                                    
	#     writer = csv.writer(f)                                                       
	#     writer.writerow(row)
	# self.csvfile = open('output.csv', 'wb') 
	# 	self.spamwriter = csv.writer(self.csvfile, delimiter=',',
 #                        quotechar='|', quoting=csv.QUOTE_MINIMAL)

	# 	self.spamwriter.writerow(['retweets', 'times', 'pos', 'neg', 'bias']);




	# self.spamwriter.writerow([i/1000,self.oOutput['o1'],self.oOutput['o2']])	
    csvfile = open('test_tweets.csv', 'wb')
    writer = csv.writer(csvfile, delimiter=',',
                        quotechar='|', quoting=csv.QUOTE_MINIMAL)

    writer.writerow(['retweets', 'times', 'pos', 'neg', 'bias']);
    for item in cur.fetchall() :
        print item[0]
        # print type(item)
        writer.writerow([item[0],item[1], item[2], item[3]])

	
# print "Using MySQLdb"
# import MySQLdb
# myConnection = MySQLdb.connect( host=hostname, user=username, passwd=password, db=database )
# doQuery( myConnection )
# myConnection.close()

print "Using pymysql"
import pymysql
myConnection = pymysql.connect( host=hostname, user=username, passwd=password, db=database )
doQuery( myConnection )
myConnection.close()



# print "Using mysql.connector"
# import mysql.connector
# myConnection = mysql.connector.connect( host=hostname, user=username, passwd=password, db=database )
# doQuery( myConnection )
# myConnection.close()
