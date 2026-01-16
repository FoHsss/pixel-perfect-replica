import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border py-12 mt-auto">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="flex flex-col gap-2">
            <span className="font-display text-lg font-semibold text-foreground">Eluro</span>
            <span className="text-sm text-muted-foreground">Thoughtfully chosen</span>
          </div>
          <nav className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <a href="mailto:hello@eluro.co" className="hover:text-foreground transition-colors duration-300">hello@eluro.co</a>
            <Link to="/privacy" className="hover:text-foreground transition-colors duration-300">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors duration-300">Terms of Service</Link>
          </nav>
        </div>
        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Eluro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
