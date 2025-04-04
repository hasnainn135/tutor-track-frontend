import { NextPage } from 'next';

const Home: NextPage = () => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}


            {/* Main Content */}
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="bg-primary_green text-light_green py-20">
                    <div className="container mx-auto px-6 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            Welcome to TutorTrack
                        </h1>
                        <p className="text-lg md:text-xl mb-8">
                            An integrated platform designed to streamline online tutoring, ensuring seamless scheduling, precise time tracking, and effortless tutor discovery.
                        </p>
                        <a
                            href="/signup"
                            className="bg-light_green text-dark_green px-8 py-3 rounded font-semibold hover:bg-bright_green transition duration-300"
                        >
                            Get Started
                        </a>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-16 bg-light_green">
                    <div className="container mx-auto px-6">
                        <h2 className="text-3xl font-bold text-center text-dark_green mb-12">Features</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-white rounded shadow p-6">
                                <h3 className="text-xl font-semibold mb-4 text-dark_green">Efficient Scheduling</h3>
                                <p className="text-gray-600">
                                    Eliminate manual coordination with an integrated calendar that syncs seamlessly across platforms.
                                </p>
                            </div>
                            <div className="bg-white rounded shadow p-6">
                                <h3 className="text-xl font-semibold mb-4 text-dark_green">Tutor Discovery</h3>
                                <p className="text-gray-600">
                                    Find the perfect tutor matching your needs with our intuitive, integrated search and recommendation system.
                                </p>
                            </div>
                            <div className="bg-white rounded shadow p-6">
                                <h3 className="text-xl font-semibold mb-4 text-dark_green">Accurate Time Tracking</h3>
                                <p className="text-gray-600">
                                    Track session durations precisely, ensuring fair compensation and transparent record-keeping.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section id="about" className="py-16">
                    <div className="container mx-auto px-6">
                        <h2 className="text-3xl font-bold text-center text-dark_green mb-12">About TutorTrack</h2>
                        <div className="max-w-3xl mx-auto text-center">
                            <p className="text-gray-600 text-lg">
                                Online learning has seen exponential growth, especially after the COVID-19 pandemic. However, fragmented tools and systems have led to challenges for tutors and students alike. TutorTrack bridges these gaps by offering an all-in-one solution that simplifies scheduling, ensures accurate time tracking, and enhances tutor discovery.
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer id="contact" className="bg-dark_green text-light_green py-8">
                <div className="container mx-auto px-6 text-center">
                    <p className="mb-4">&copy; {new Date().getFullYear()} TutorTrack. All rights reserved.</p>
                    <p>
                        Contact us:{" "}
                        <a href="mailto:support@tutortrack.com" className="underline text-bright_green">
                            support@tutortrack.com
                        </a>
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
