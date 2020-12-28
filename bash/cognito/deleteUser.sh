#!/usr/local/bin/bash

# USER_POOL_ID="compapida3444db_userpool_da3444db-compapi"

# RUN=1
# until [ $RUN -eq 0 ] ; do
# echo "Listing users"
# USERS=`aws --profile myProfile cognito-idp list-users  --user-pool-id ${USER_POOL_ID} | grep Username | awk -F: '{print $2}' | sed -e 's/\"//g' | sed -e 's/,//g'`
# if [ ! "x$USERS" = "x" ] ; then
# 	for user in $USERS; do
# 		echo "Deleting user $user"
# 		aws --profile myProfile cognito-idp admin-delete-user --user-pool-id ${USER_POOL_ID} --username ${user}
# 		echo "Result code: $?"
# 		echo "Done"
# 	done
# else
# 	echo "Done, no more users"
# 	RUN=0
# fi
# done

read -e -p "User Pool Id:" -i "ap-southeast-1_5zmaTsBgU" COGNITO_USER_POOL_ID

read -e -p "User Name:" -i "Facebook_10224795420532374" uname

aws cognito-idp admin-delete-user --user-pool-id $COGNITO_USER_POOL_ID --username $uname
