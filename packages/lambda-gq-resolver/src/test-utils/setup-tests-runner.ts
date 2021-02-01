import * as child from 'child_process';

import deasync from 'deasync';

export default (): void => {
    const exec = deasync(child.exec);

    try {
        console.log('start setup');
        console.log(exec(`cd "${__dirname}" && yarn test:setup`));
        console.log('end setup');
    } catch (err) {
        console.log(err);
    }
};
