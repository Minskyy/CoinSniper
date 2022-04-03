#!/usr/bin/env python

from __future__ import print_function
import os
import requests
from bs4 import BeautifulSoup
import csv
import time

RESULTS = "results.csv"
URL = "https://bscscan.com/token/generic-tokenholders2?a=0x8a48cec6c41b5827ecc1f68e3630cd40aa4d508c&s=0&p="

def getData(sess, page):
    url = URL + page
    print("Retrieving page", page)
    return BeautifulSoup(sess.get(url).text, 'html.parser')

def getPage(sess, page):
    table = getData(sess, str(int(page))).find('table')
    try:
        data = [[X.text.strip() for X in row.find_all('td')] for row in table.find_all('tr')]
    except:
        data = None
    finally:
        return data

def main():
    resp = requests.get(URL)
    sess = requests.Session()

    with open(RESULTS, 'w') as f:
        wr = csv.writer(f, quoting=csv.QUOTE_ALL)
        wr.writerow(map(str, "Rank Address Quantity Percentage".split()))
        page = 1
        data = getPage(sess, page)
        for row in data:
            wr.writerow(row)

        # while True:
        #     page += 1
        #     data = getPage(sess, page)

        #     if data == None:
        #         break
        #     else:
        #         for row in data:
        #             wr.writerow(row)
        #         time.sleep(1)

if __name__ == "__main__":
    main()