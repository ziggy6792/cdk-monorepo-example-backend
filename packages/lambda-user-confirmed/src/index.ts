/* eslint-disable import/prefer-default-export */
import 'source-map-support/register';

process.env.AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || 'ASIA2DP7X6SIKCBDJ75E';
process.env.AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || 'F3m978pvzA9BKPxZzcnt41xzT5ynZn1V3ofpUrx7';
process.env.AWS_SESSION_TOKEN =
  process.env.AWS_SESSION_TOKEN ||
  // eslint-disable-next-line max-len
  'IQoJb3JpZ2luX2VjEDQaDmFwLXNvdXRoZWFzdC0xIkgwRgIhAMVhO7Vbw7T2T38npzUrl7tbC4N1H0COY/TaWOq0oS55AiEA5sd9Igs5Z1To+ocJYOo2YMb6hNr64ZP2Qj12PfVQX7sq6wEIzf//////////ARAAGgw2OTQ3MTA0MzI5MTIiDIrd5mOzNI/4wqVHBiq/AZgSyGs6Jf+L9UxnsOC0Yrg6jcXpdMJHpJl6e7uARiJl6EWhA9TmKJA/qnmRXeSzX0/98EAk6XPweWKWWPuS7KvR3h6f3DhgbTAWyhVd9JL8whIrBFCfo0StZ4cBD8Dn2EkdUNwzkvdesunccRQ6HE7FSTH7gJvwujUvnat/mpFC0+ufIzVyr+C4rtSjxmNVm0k2LL4VUqJD/3zBvbIIlZrFHG1dSCi2ygia5+2XKexuW11VoDo9q9k+l1GAOzeBMPPD2/4FOt8BTR08mDVzvwCgOdqHrD5h/IKwH/BfhM2OqJ9n0l3eGnGuBB57f76dnTuQ1az9vdGruJjeewB+y5XTrgH/TctXVcdfTWxgEHwG1QV31fuFfuE/ZIQvSdbtEJ3s82o/v2R0mSDkAF2g+E4HTu/0mq2EEJZhMrhan35R94PLfDUoNm0GlNAXFEN9qOLNGGGTfO/7vGFyuzzE6/SNTUmB8Eak/dH5251z+1ULAT6hlg23Z2Zkov8NoOYSBGTOcP88Hsfz3BytyygVV8WNuKX8Z9ejCsAQYboDgfMdjkcOXLBprg==';

export const handler = async (event: any): Promise<any> => {
  const logText = `
  process.env.AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || '${process.env.AWS_ACCESS_KEY_ID}';
  process.env.AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || '${process.env.AWS_SECRET_ACCESS_KEY}';
  process.env.AWS_SESSION_TOKEN =
    process.env.AWS_SESSION_TOKEN ||
    // eslint-disable-next-line max-len
    '${process.env.AWS_SESSION_TOKEN}' `;

  console.log(logText);

  return {
    statusCode: 200,
    body: JSON.stringify({
      success: 'hello',
    }),
  };
};
