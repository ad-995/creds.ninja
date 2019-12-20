#!/usr/bin/python3

import csv, json, sys

'''
	create_obj.py takes in a csv file containing: vendor, username, password, version.
	From this, create_obj will transform it into a json object:
	{
		"1": {
			"vendor": "cisco",
			"username": "cisco_username",
			"password": "cisco_123"
			"version": "Cisco ASA"
		}
	}

	If the version is unknown, it can be set to "*". Otherwise, setting it to a specific solution is viable.
'''

'''
	- Best usecase:
		python3 create_obj.py <infile> <outfile>|jq
	- Piping to jq is a good way to validate the json conversion worked properly. Thats also the reason why there are no other print statements in this script

'''


def read_csv(filename):
	return_data = dict() # Create the empty dictionary that will be returned
	try:
		with open(filename,'r') as f: # open the csv file
			csv_read = csv.reader(f,delimiter=',') # read from the csv file
			for counter,row in enumerate(csv_read): #loop over each row
				if counter != 0: # ignore header, this wont be required within the json but it should always be within the csv.
					blob = dict() # initiate the blob that will be appended to the return_data. This will be "1": {"data: value"}
					index_number = str(counter) # give it a better name and convert it to a string

					try: # pull out each piece of data
						vendor = row[0] 
						username = row[1]
						password = row[2]
					except:
						print('Failed to pull data from row %s' % counter)
						quit()

					# Create the record
					record = {
						"vendor":vendor,
						"username":username,
						"password":password
					}

					return_data[index_number] = record # set the data of the index number to be the record
	except Exception as e:
		print(e)
		quit()

	return json.dumps(return_data) # return a json object


try: # check the arguments
	infile = sys.argv[1]
	outfile = sys.argv[2]
except:
	print('Specify the following syntax:')
	print('python3 create_obj.py <infile> <outfile>')
	quit()

json_object = read_csv(infile) # call the function and create the object

with open(outfile,'w') as f:
	try:
		json.dump(json.loads(json_object),f,ensure_ascii=False) # load the json and then dump it to file
	except  Exception as e:
		print(e)
		quit()

# ggwp.
