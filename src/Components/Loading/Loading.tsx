import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { RotatingLines } from "react-loader-spinner";

interface LoadingProps {
  children: React.ReactNode;
}

const Loading: React.FC<LoadingProps> = ({ children }) => {
  const loading = useSelector((state: RootState) => state.status.loading);

  if (loading) {
    return (
      <div className='w-full h-screen flex items-center justify-center'>
        <RotatingLines
          // height="90"
          width='90'
          // radius="9"
          //   color="gray"
          ariaLabel='loading'
        />
      </div>
    );
  } else {
    return <>{children}</>;
  }
};

export default Loading;
