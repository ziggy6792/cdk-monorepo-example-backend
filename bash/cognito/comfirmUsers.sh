# #!/bin/bash
event="event.json"
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

filePath=${DIR}/${event}

jsonTree=$(cat ${filePath})

read -e -p "User Pool Id:" -i "ap-southeast-1_TUK8FPaMg" COGNITO_USER_POOL_ID

readarray -t users < <(aws cognito-idp list-users --user-pool-id $COGNITO_USER_POOL_ID | jq '.Users' | jq -c -r '.[]')

for user in "${users[@]}"; do
   readarray -t userAtts < <(echo $user | jq '.Attributes' | jq -c '.[]')

   declare -A aserAttsMap

   for i in "${userAtts[@]}"; do
      # do whatever on $i
      key=$(echo $i | jq -r '.Name')
      value=$(echo $i | jq -r '.Value')
      aserAttsMap[$key]=$value
   done

   lambdaInput=${DIR}/build/confirmUserInput.json
   lambdaOutput=${DIR}/build/confirmUserOutput.json

   # ToDo check if already confirmed

   # Id
   jsonTree=$(echo ${jsonTree} | jq '.userName ='\"${aserAttsMap["sub"]}\")
   jsonTree=$(echo ${jsonTree} | jq '.request.userAttributes.sub ='\"${aserAttsMap["sub"]}\")

   # email
   jsonTree=$(echo ${jsonTree} | jq '.request."cognito:email_alias" ='\"${aserAttsMap["email"]}\")
   jsonTree=$(echo ${jsonTree} | jq '.request.userAttributes."cognito:email_alias" ='\"${aserAttsMap["email"]}\")
   jsonTree=$(echo ${jsonTree} | jq '.request.userAttributes.email ='\"${aserAttsMap["email"]}\")

   # family name
   jsonTree=$(echo ${jsonTree} | jq '.request.userAttributes.family_name ='\"${aserAttsMap["family_name"]}\")

   # given name
   jsonTree=$(echo ${jsonTree} | jq '.request.userAttributes.given_name ='\"${aserAttsMap["given_name"]}\")

    # gender
   jsonTree=$(echo ${jsonTree} | jq '.request.userAttributes.gender ='\"${aserAttsMap["gender"]}\")

   echo $jsonTree >lambdaInput

   echo ${jsonTree} | jq >$lambdaInput

   echo ${aserAttsMap["given_name"]} " " ${aserAttsMap["family_name"]}

   aws lambda invoke --function-name cognitoPostConfirm-compapi --payload file://$lambdaInput --cli-binary-format raw-in-base64-out $lambdaOutput
done