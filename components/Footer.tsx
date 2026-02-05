
export default function SimpleFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-card py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-center md:text-left">
            © {currentYear} Akhila Bharatiya Brahmana Mahasangh. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6 text-sm text-muted-foreground">
            <a href="/privacy-policy" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-primary transition-colors">
              Terms of Service
            </a>
            <a href="/contact" className="hover:text-primary transition-colors">
              Contact Us
            </a>
          </div>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-4">
          A platform for unity, culture, and community welfare
        </p>
      </div>
    </footer>
  );
}