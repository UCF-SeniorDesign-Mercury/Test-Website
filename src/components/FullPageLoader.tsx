import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

const FullPageLoader = (): JSX.Element  => {
  return (
    <div className='full-page-loader-container'>
      <Box sx={{ 
        position: 'absolute', 
        width: '100%',
        height: '100%',
        zIndex:1, 
        background: 'rgba(198, 212, 252, 0.452)',
      }}>
        <CircularProgress size='100px'
          sx={{ 
            position: 'absolute', 
            opacity: '80%',
            top: '30%',
            left: '45%',
          }}
        />
        <Typography variant="h1"
          sx={{
            position: 'absolute', 
            opacity: '80%',
            top: '44%',
            left: '45.5%',
            fontSize: '100%'
          }}>
          Please Wait
        </Typography>
      </Box>
    </div>
  );
};

export default FullPageLoader;