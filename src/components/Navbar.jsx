// 1. We import the image file straight from the assets folder!
import logo from '../assets/logo.jpg'

const Navbar = () => {
  return (
    <header className="w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 py-4 flex items-center justify-between z-40">
      
      {/* Brand Logo & Name */}
      <div className="flex items-center gap-3">
        {/* 2. We use the imported 'logo' right here in the image tag */}
        <img 
          src={logo} 
          alt="ApexForge Logo" 
          className="w-10 h-10 rounded-xl border border-slate-800 shadow-lg object-cover"
        />
        <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          Apex<span className="text-blue-500 font-medium">Forge</span>
        </span>
      </div>

      {/* Navigation Links & Wallet Connect */}
      <div className="flex items-center gap-6">
        <a href="#whitepaper" className="hidden sm:inline-block text-sm font-medium text-slate-400 hover:text-white transition-colors">
          Whitepaper
        </a>
        <button className="relative group overflow-hidden px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 font-semibold text-sm text-white shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all duration-300">
          <span className="relative z-10">Connect Wallet</span>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
      </div>

    </header>
  )
}

export default Navbar