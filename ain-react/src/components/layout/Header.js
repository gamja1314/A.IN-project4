export const Header = ({ title }) => {
    return (
      <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b flex items-center justify-center z-50 max-w-md mx-auto">
        <h1 className="text-lg font-semibold">{title}</h1>
      </header>
    );
  };