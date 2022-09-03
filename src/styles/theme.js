import {createTheme} from '@mui/material/styles';
import {cyan, teal} from '@mui/material/colors';

export const theme = createTheme({
    palette: {
        primary: {
            main: '#47b39d',
            contrastText: '#fff',
        },
        gray: {
            main: '#37465b',
        },
        white: {
            main: '#fff',
        },
        contrastThreshold: 3,
    },
    typography: {
        fontSize: 22,
        fontFamily: [
            'Roboto',
            'sans-serif',
        ].join(','),
    },
});

// --main-color: #47b39d;
// --grey-color: #37465b;
// --dark-color: #212b38;
// --light-color: #fff;