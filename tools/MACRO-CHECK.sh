#!/bin/bash

set -e

if [ "" == "$1" ]; then
  exit 0
fi

STUB="$(dirname $0)/$(basename $0 .sh)"

cat $1 | grep '<macro.*name="[^\"]\+"' \
       | sed -e 's/.*<macro.*name="\([^\"]\+\)".*/\1/' \
       | sort | uniq > ${STUB}.macros
cat $1 | grep '<\(text\|key\).*macro="[^\"]\+"' \
       | sed -e 's/.*<\(text\|key\).*macro="\([^\"]\+\)".*/\2/' \
       | sort \
       | uniq > ${STUB}.calls
# Dupes check
echo
echo Duplicates:
cat $1 | grep '<macro.*name="[^\"]\+"' \
       | sed -e 's/.*<macro.*name="\([^\"]\+\)".*/\1/' \
       | sort | uniq --repeated
# Call/Macro alignment failures
echo
echo Call/Macro alignment failures:
diff -u ${STUB}.calls ${STUB}.macros
echo
