cursor = test_col.find(no_cursor_timeout=True)
count = 0
for item in cursor:
	cursor1 = test_col.find(no_cursor_timeout=True)
	for item1 in cursor1:
		# if (item['Text'] == item1['Text']) & (item['_id'] != item1['_id']) & (item['Username'] != item1['Username']): 
		if item == item1:	
			test_col.remove(item)
			print "Deleteing Item......................."
		else:
			print "No match>>>>>>>>>>>>>>>>>>>>>>\n"
	print count
	count = count + 1
	test_col.insert_one(item)

# Duplication collection
from pymongo import MongoClient
client = MongoClient()
client.twitter.collection_names()

collection = client.twitter.milk_collection
test_col = client.test.milk_collection
cursor = collection.find(no_cursor_timeout=True)
for item in cursor:
	print item
	test_col.insert_one(item)

# mongo shell
var res=db.corn_collection.find();
while(res.hasNext()){
      var res1=db.test.find(); 
      var re=res.next();
      while(res1.hasNext()){
              var re1=res1.next();
              if(re.Text==re1.Text){ 
                   db.test.remove({"Text":re1.Text});
                   printjson(re)
               }
       print("looping")
       } 
       db.corn_collection.insert(re); 
}

# delete duplication
collection = db.sbux_collection
var cur = collection.aggregate([{ $group: { _id: { Username: "$Username", Text: "$Text"}, uniqueIds: { $addToSet: "$_id" }, count: { $sum: 1 } } }, { $match: { count: { $gt: 1 } } }],{allowDiskUse:true});
while (cur.hasNext()) {
    var doc = cur.next();
    var index = 1;
    print("Coming into loop")
    while (index < doc.uniqueIds.length) {
        collection.remove(doc.uniqueIds[index]);
        index = index + 1;
        print(index)
    }
}



cursor = db.kef_collection.aggregate(
   [
     {
       $project:
         {
           year: { $year: "$date" },
           month: { $month: "$date" },
           day: { $dayOfMonth: "$date" },
           hour: { $hour: "$date" },
           minutes: { $minute: "$date" },
           seconds: { $second: "$date" },
           milliseconds: { $millisecond: "$date" },
           dayOfYear: { $dayOfYear: "$date" },
           dayOfWeek: { $dayOfWeek: "$date" },
           week: { $week: "$date" }
         }
     }
   ]
)

cursor.forEach(function(mydoc){ print(1);});
cursor = kfc.aggregate([{$project:{year: { $year: "$date" },month: { $month: "$date" },day: { $dayOfMonth: "$date" },hour: { $hour: "$date" },minutes: { $minute: "$date" },seconds: { $second: "$date" },milliseconds: { $millisecond: "$date" },dayOfYear: { $dayOfYear: "$date" },dayOfWeek: { $dayOfWeek: "$date" },week: { $week: "$date" }}}])