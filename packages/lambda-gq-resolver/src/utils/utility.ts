export const VALUE = {
    NULL: 'NULL',
};

export const valueIsNull = (value: any): boolean => value === null || value === undefined || value === VALUE.NULL;
