import '../css/AboutPage.css';

export default function AboutPage() {
    return (
        <div className="about-page">
            <h1 className="about-title">About Tech Pulse</h1>
            <p className="about-description">
                Tech Pulse is a comprehensive platform designed to provide insights into the world of software development.
                Our mission is to empower developers, teams, and organizations with the tools and data they need to make informed decisions about their projects and stay ahead in the ever-evolving tech landscape.
            </p>
            <h2 className="our-features-title">Our Features</h2>
            <ul className="features-list">
                <li className="feature-item"><strong>Repository Comparison:</strong> Compare multiple repositories side by side to analyze their performance, activity, and health.</li>
                <li className="feature-item"><strong>Trending Repositories:</strong> Discover the most popular repositories in various programming languages and categories.</li>
                <li className="feature-item"><strong>Statistics Dashboard:</strong> Access detailed statistics and visualizations about repository activity, contributor engagement, and more.</li>
                <li className="feature-item"><strong>Collections:</strong> Create and manage collections of repositories for easy access and organization.</li>
                <li className="feature-item"><strong>Search Functionality:</strong> Quickly find repositories based on keywords, topics, or specific criteria.</li>
            </ul>
            <h2 className="our-team-title">Our Team</h2>
            <p className="our-team-description">
                Tech Pulse was developed by a passionate team of software engineers and data analysts who are dedicated to improving the developer experience. We believe in the power of open source and strive to create tools that benefit the entire developer community.
            </p>
            <h2 className="contact-title">Contact Us</h2>
            <p className="contact-description">
                We would love to hear from you! If you have any questions, feedback, or suggestions, please feel free to reach out to us at <a href="mailto:info@techpulse.com">info@techpulse.com</a>.
            </p>
        </div>
    );
}