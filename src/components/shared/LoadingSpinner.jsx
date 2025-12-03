const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <div className="text-xl text-gray-600">Loading...</div>
        <div className="text-sm text-gray-500 mt-2">Checking authentication...</div>
      </div>
    </div>
  );
};

export default LoadingSpinner;

