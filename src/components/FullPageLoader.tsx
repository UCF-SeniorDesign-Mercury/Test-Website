import LoadingGIF from '../assets/loading-gif.gif';
import './FullPageLoader.css';

const FullPageLoader = (): JSX.Element  => {
  return (
    <div className='full-page-loader-container'>
      <img src={LoadingGIF} className="full-page-loader" alt="loading"></img>
    </div>
  );
};

export default FullPageLoader;