#!/bin/bash

# Please see https://www.w3.org/XML/2004/xml-schema-test-suite/#getit for an explaination of the numbered steps below.

# setup the directory structure
BASE=./xmlschema-test-suite
A=$BASE/xsts-current
B=$BASE/xmlschema2006-11-06
mkdir -p $A
mkdir -p $B

# 1. Download the latest release in ...tar.gz form.
echo "curl https://www.w3.org/XML/2004/xml-schema-test-suite/xmlschema2006-11-06/xsts-2007-06-20.tar.gz -o $BASE/xsts-2007-06-20.tar.gz"
curl https://www.w3.org/XML/2004/xml-schema-test-suite/xmlschema2006-11-06/xsts-2007-06-20.tar.gz -o $BASE/xsts-2007-06-20.tar.gz

# 2. Unpack the tarred and gzipped file into location B.
echo "cd $BASE"
echo "tar -xzvf  ./xsts-2007-06-20.tar.gz"
echo "cd .."
cd $BASE
tar -xzvf  ./xsts-2007-06-20.tar.gz
cd ..

# 3. Check out the CVS tree from dev.w3.org into location A.
echo "cvs -d :pserver:anonymous:anonymous@dev.w3.org:/sources/public checkout -d $A XML/xml-schema-test-suite/2004-01-14/xmlschema2006-11-06"
cvs -d :pserver:anonymous:anonymous@dev.w3.org:/sources/public checkout -d $A XML/xml-schema-test-suite/2004-01-14/xmlschema2006-11-06

# 4. Move everything from the tree at B which is not already under A into the parallel place in A to where it is in B.
echo "cp -R -p -n -v $B/ $A"
cp -R -p -n -v $B/ $A

echo "SUCESS!  Xml Schema Test Suite Setup"
