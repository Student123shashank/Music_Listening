const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white py-2">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          <p className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-violet-400 mb-1">
            Music Listening
          </p>
          <p className="text-xs text-gray-300 mb-2">
            Your gateway to musical bliss
          </p>
          <div className="border-t border-gray-700 w-full pt-3 text-center text-gray-400 text-xs">
            <p>&copy; {new Date().getFullYear()} Music Listening. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer