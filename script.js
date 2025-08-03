document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.getElementById("nav-links");
    const darkToggle = document.getElementById("darkToggle");
    const contactForm = document.getElementById("contactForm");
    const formResponse = document.getElementById("formResponse");
    const navbar = document.querySelector('.navbar');

    // New variables for the spinner
    const formSpinner = document.getElementById("formSpinner");
    const submitButton = contactForm ? contactForm.querySelector('button[type="submit"]') : null;

    // --- Hero Section Entrance Animation ---
    const animateHeroSection = () => {
        const homeTitle = document.querySelector('.home-title');
        const homeSubtitle = document.querySelector('.home-subtitle');
        const homeButtons = document.querySelector('.home-buttons');
        const techLogos = document.querySelector('.tech-logos');

        if (homeTitle) homeTitle.classList.add('animate-in');
        if (homeSubtitle) homeSubtitle.classList.add('animate-in');
        if (homeButtons) homeButtons.classList.add('animate-in');
        if (techLogos) techLogos.classList.add('animate-in');
    };

    // Call the hero animation function after a small delay to ensure CSS is rendered
    requestAnimationFrame(() => {
        animateHeroSection();
    });

    // --- Dark Mode Persistence ---
    const applyDarkMode = (isDark) => {
        document.body.classList.toggle("dark", isDark);
        if (darkToggle) {
            darkToggle.textContent = isDark ? '☀️' : '🌓';
        }
    };

    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
        applyDarkMode(true);
    } else {
        applyDarkMode(false);
    }

    if (darkToggle) {
        darkToggle.addEventListener("click", () => {
            const isDark = document.body.classList.toggle("dark");
            localStorage.setItem('darkMode', isDark);
            applyDarkMode(isDark);
        });
    }

    // --- Mobile Menu Toggle ---
    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            });
        });
    }

    // --- Dynamic Scroll Padding for Navbar ---
    const updateScrollPadding = () => {
        if (navbar) {
            const navbarHeight = navbar.offsetHeight;
            document.documentElement.style.setProperty('--scroll-padding-top', `${navbarHeight + 10}px`);
        }
    };

    updateScrollPadding();
    window.addEventListener('resize', updateScrollPadding);

    // --- Contact Form Submission (with Spinner) ---
    if (contactForm && formResponse && formSpinner && submitButton) {
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const formData = {
                name: contactForm.name.value,
                email: contactForm.email.value,
                company: contactForm.company ? contactForm.company.value : '',
                message: contactForm.message.value,
            };

            // Show spinner, disable button, update text
            formResponse.textContent = "Sending message...";
            formResponse.style.color = "var(--text-color)"; // Use CSS variable for text color
            formSpinner.style.display = 'inline-block'; // Show spinner
            submitButton.disabled = true; // Disable button

            try {
                // IMPORTANT: Replace with your actual server endpoint
                const res = await fetch("https://sandipshub.onrender.com/api/contact", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                });

                const data = await res.json();
                if (res.ok) {
                    formResponse.textContent = "Message sent successfully! Thank you.";
                    formResponse.style.color = "var(--secondary-color)"; // Success color
                    contactForm.reset();
                } else {
                    formResponse.textContent = data.error || "Failed to send message. Please try again.";
                    formResponse.style.color = "red"; // Error color
                }
            } catch (err) {
                console.error("Error submitting form:", err);
                formResponse.textContent = "Error connecting to the server. Please check your network.";
                formResponse.style.color = "red"; // Error color
            } finally {
                formSpinner.style.display = 'none'; // Hide spinner
                submitButton.disabled = false; // Re-enable button
            }
        });
    }

    // --- Combined Scroll Spy and Smooth Scrolling Logic ---
    const sections = document.querySelectorAll('section, header.home');
    const allNavLinks = document.querySelectorAll('.nav-links a');

    // Function to set the active navigation link based on scroll position
    function activateNavLink() {
        // Only run scroll spy on the index.html page
        if (location.pathname.includes('index.html') || location.pathname === '/') {
            let currentSectionId = '';
            const scrollY = window.scrollY;
            const navbarHeight = navbar ? navbar.offsetHeight : 0;

            sections.forEach(section => {
                // Adjust sectionTop for scroll-padding-top if it exists
                const sectionTop = section.offsetTop - navbarHeight - 5;
                const sectionHeight = section.clientHeight;

                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    currentSectionId = section.getAttribute('id');
                }
            });

            allNavLinks.forEach(link => {
                link.classList.remove('active'); // Remove active from all links first

                // Activate link if its href matches the current section ID
                if (link.getAttribute('href') && link.getAttribute('href').includes(`#${currentSectionId}`)) {
                    // Special condition: only activate 'home' if scrollY > 0 or it's not the initial load at 0
                    if (currentSectionId === 'home' && scrollY === 0) {
                        // Do not activate 'home' at the very top (initial load)
                    } else {
                        link.classList.add('active');
                    }
                }
            });

            // Special handling for when at the absolute top (scrollY is 0)
            // Ensure no link is active when the page is first loaded at the top.
            if (scrollY === 0) {
                allNavLinks.forEach(link => link.classList.remove('active'));
            }

        }
        // Special case for project detail pages: 'Projects' should always be active
        else if (location.pathname.includes('/projects/')) {
            allNavLinks.forEach(link => {
                link.classList.remove('active'); // Ensure other links are not active
                if (link.getAttribute('href') && link.getAttribute('href').includes('#projects')) {
                    link.classList.add('active');
                }
            });
        }
    }

    // --- Handle Clicks on Navigation Links ---
    allNavLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetHref = this.getAttribute('href');
            const isInternalAnchor = targetHref.startsWith('#'); // e.g., #home
            // Check if the link is intended to go to index.html, potentially with a hash
            const isTargetingIndexPage = targetHref.includes('index.html') || (isInternalAnchor && location.pathname.includes('/projects/'));
            const isCurrentPageIndex = (location.pathname.includes('index.html') || location.pathname === '/');

            // Prevent default only for navigation that we will handle explicitly
            if (isInternalAnchor || isTargetingIndexPage) {
                e.preventDefault();
            }

            if (isInternalAnchor && isCurrentPageIndex) {
                // Scenario 1: On index.html, clicking an anchor on the same page (smooth scroll)
                const targetElement = document.querySelector(targetHref);
                const currentNavbarHeight = navbar ? navbar.offsetHeight : 0;
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - currentNavbarHeight;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
                // Update active state immediately
                allNavLinks.forEach(link => link.classList.remove('active'));
                this.classList.add('active');

            } else if (isTargetingIndexPage && !isCurrentPageIndex) {
                // Scenario 2: On a project detail page (or any other sub-page), clicking a link to go back to index.html#section
                const currentPathParts = window.location.pathname.split('/');
                let basePath = '';

                // This logic tries to find 'frontend' in the path, otherwise defaults to root
                const frontendIndex = currentPathParts.indexOf('frontend');
                if (frontendIndex !== -1) {
                    basePath = currentPathParts.slice(0, frontendIndex + 1).join('/') + '/';
                } else {
                    // This handles cases where you might be serving from root or a different subfolder
                    const lastSlash = window.location.pathname.lastIndexOf('/');
                    basePath = window.location.pathname.substring(0, lastSlash + 1).includes('projects/') ?
                                             window.location.pathname.substring(0, window.location.pathname.indexOf('/projects/') + 1) : '/';
                }

                let newUrl = window.location.origin + basePath + 'index.html';

                if (targetHref.includes('#')) {
                    newUrl += targetHref.substring(targetHref.indexOf('#'));
                } else if (isInternalAnchor) {
                    newUrl += targetHref;
                }

                window.location.href = newUrl;

            } else {
                // Scenario 3: Let other links (e.g., external URLs) behave normally
                return;
            }

            // Close mobile menu after clicking a link, if it's open
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        });
    });

    // --- Handle Initial Load with Hash (for detail pages linking back to index.html) ---
    const handleHashScrollOnLoad = () => {
        const currentNavbarHeight = navbar ? navbar.offsetHeight : 0;

        // If currently on index.html and there's a hash, scroll to it
        if (window.location.hash && (location.pathname.includes('index.html') || location.pathname === '/')) {
            const targetElement = document.querySelector(window.location.hash);
            if (targetElement) {
                requestAnimationFrame(() => {
                    const offsetTop = targetElement.offsetTop - currentNavbarHeight;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    // Set the active class on the corresponding nav link
                    allNavLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') && link.getAttribute('href').includes(window.location.hash)) {
                            link.classList.add('active');
                        }
                    });
                });
            }
        }
        // If on index.html and no hash, or scrolled to top, ensure no link is active initially
        else if (location.pathname.includes('index.html') || location.pathname === '/') {
            // Explicitly remove all active classes on initial load if no hash
            allNavLinks.forEach(link => link.classList.remove('active'));
            // No need to call activateNavLink here on load; it will be called by 'scroll' event.
        }
        // If on a project detail page, activate 'Projects'
        else if (location.pathname.includes('/projects/')) {
            allNavLinks.forEach(link => {
                link.classList.remove('active'); // Ensure other links are not active
                if (link.getAttribute('href') && link.getAttribute('href').includes('#projects')) {
                    link.classList.add('active');
                }
            });
        }
    };

    window.addEventListener('load', handleHashScrollOnLoad);

    // Event listener for scroll (only on index.html for continuous updates)
    if (location.pathname.includes('index.html') || location.pathname === '/') {
        window.addEventListener('scroll', activateNavLink);
    }

    // --- Project Data Array ---
    const myProjects = [
        {
            title: "Amazon PPC Performance Dashboard",
            description: "Developed an interactive Power BI dashboard for Amazon PPC campaign optimization, leading to a 20% increase in Ad ROAS.",
            category: "analytics",
            detailPage: "projects/amazon-ppc-dashboard.html",
            // githubRepo: "" // Removed githubRepo property
        },
        {
            title: "Customer Churn Prediction",
            description: "Developed a machine learning model to predict customer churn, allowing for proactive retention strategies.",
            category: "analytics",
            detailPage: "projects/customer-churn-prediction.html",
            // githubRepo: "https://github.com/sandizero/customer-churn-prediction" // Removed githubRepo property
        },
        {
            title: "Sales Performance Dashboard",
            description: "Created an interactive Power BI dashboard to visualize sales trends, identify top-performing products, and track KPIs.",
            category: "analytics",
            detailPage: "projects/sales-dashboard.html",
            // githubRepo: "https://github.com/sandizero/sales-dashboard-powerbi" // Removed githubRepo property
        },
        {
            title: "Automated Invoice Processing",
            description: "Implemented an n8n workflow to automatically extract data from incoming email invoices, process the information, and update a financial database. Reduced manual data entry by 90%.",
            category: "automation",
            detailPage: "projects/invoice-automation.html",
            // githubRepo: "" // Removed githubRepo property
        },
        {
            title: "Financial Dashboard",
            description: "Developed an interactive dashboard for financial data analysis using Tableau and Python.",
            category: "analytics",
            detailPage: "projects/financial-dashboard.html",
            // githubRepo: "" // Removed githubRepo property
        },
        {
            title: "Automated Email Responder",
            description: "Created a Python script to automate responses to common customer service inquiries.",
            category: "automation",
            detailPage: "projects/email-responder.html",
            // githubRepo: "" // Removed githubRepo property
        },
        {
            title: "Sales Performance Tracker",
            description: "A web-based tool for tracking and visualizing real-time sales performance metrics.",
            category: "analytics",
            detailPage: "projects/sales-tracker.html",
            // githubRepo: "" // Removed githubRepo property
        },
        {
            title: "Data Entry Bot",
            description: "RPA bot built with UiPath to automate repetitive data entry tasks in legacy systems.",
            category: "automation",
            detailPage: "projects/data-entry-bot.html",
            // githubRepo: "" // Removed githubRepo property
        }
    ];

    const projectsGrid = document.querySelector('.projects-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');

    function createProjectCards() {
        if (projectsGrid && typeof myProjects !== 'undefined' && myProjects.length > 0) {
            projectsGrid.innerHTML = ''; // Clear existing cards

            myProjects.forEach(project => {
                const projectCard = document.createElement('div');
                projectCard.classList.add('project-card', 'animate-on-scroll');
                projectCard.setAttribute('data-category', project.category);

                let buttonsHtml = '';
                if (project.detailPage) {
                    buttonsHtml += `<a href="${project.detailPage}" class="project-card-button btn">View Project</a>`;
                }
                // GitHub repo link generation block REMOVED
                // if (project.githubRepo) {
                //     buttonsHtml += `<a href="${project.githubRepo}" target="_blank" class="github-repo-link">GitHub Repo</a>`;
                // }

                projectCard.innerHTML = `
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    ${buttonsHtml ? `<div class="project-card-buttons-container">${buttonsHtml}</div>` : ''}
                `;
                projectsGrid.appendChild(projectCard);
            });
        }
    }

    // --- Project Filtering Logic ---
    const filterProjects = (category) => {
        const projectCardsInDom = document.querySelectorAll('.projects-grid .project-card');
        projectCardsInDom.forEach(card => {
            // Apply a fade-out effect first
            card.classList.remove('fade-in-up'); // Remove fade-in-up if it was added by scroll animation
            card.classList.add('hide'); // Add hide class to trigger fade out

            // Use setTimeout to ensure the fade-out transition plays before hiding completely
            setTimeout(() => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'flex'; // Use 'flex' as per your CSS for project-card
                    requestAnimationFrame(() => { // Use rAF for re-adding class after display changes
                        card.classList.remove('hide');
                        card.classList.add('fade-in-up'); // Re-add animation for fade-in
                    });
                } else {
                    card.style.display = 'none';
                }
            }, 300); // This delay should match or slightly exceed your CSS transition duration for opacity
        });
    };


    // Only create project cards if on the index.html page and set up filters
    if (location.pathname.includes('index.html') || location.pathname === '/') {
        createProjectCards(); // Call this first to populate the grid
        const initialProjectCards = document.querySelectorAll('.projects-grid .project-card');

        // Apply initial visibility for all projects
        initialProjectCards.forEach(card => {
            card.style.display = 'flex';
            card.classList.add('fade-in-up'); // Ensure initial fade-in animation
        });

        // Set up event listeners for filter buttons
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;

                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to the clicked button
                button.classList.add('active');

                filterProjects(filter);
            });
        });
        // Ensure "All" button is active on initial load
        document.querySelector('.filter-btn[data-filter="all"]')?.classList.add('active');
    }


    // --- Service Data Array ---
    const myServices = [
        {
            title: "Data Cleaning & Preparation",
            description: "I transform raw, inconsistent data into clean, structured formats, ensuring reliable insights for critical decision-making.",
            category: "data-analysis",
            detailPage: "services/data-cleaning.html"
        },
        {
            title: "Exploratory Data Analysis",
            description: "I identify key patterns, trends, and correlations to uncover meaningful insights from your data.",
            category: "data-analysis",
            detailPage: "services/eda.html"
        },
        {
            title: "Statistical Analysis",
            description: "I apply statistical techniques to validate hypotheses, uncover relationships, and generate robust predictions.",
            category: "data-analysis",
            detailPage: "services/statistical-analysis.html"
        },
        {
            title: "Dashboard Creation",
            description: "I design dynamic dashboards in Power BI & Tableau for real-time data monitoring and informed decision-making.",
            category: "data-analysis",
            detailPage: "services/dashboard-creation.html"
        },
        {
            title: "Report Generation",
            description: "I deliver comprehensive reports that translate complex data into actionable strategies for your business goals.",
            category: "data-analysis",
            detailPage: "services/report-generation.html"
        },
        {
            title: "Performance Monitoring",
            description: "I implement KPI tracking systems to evaluate ongoing performance and ensure continuous improvement.",
            category: "data-analysis",
            detailPage: "services/performance-monitoring.html"
        },
        {
            title: "Workflow Automation",
            description: "I automate routine tasks and processes to save time and reduce manual errors using n8n workflows.",
            category: "automation",
            detailPage: "services/workflow-automation.html"
        },
        {
            title: "System Integration",
            description: "I seamlessly connect APIs and third-party tools to ensure efficient data flow and business operations.",
            category: "automation",
            detailPage: "services/system-integration.html"
        },
        {
            title: "Custom Automations",
            description: "I build tailored automation solutions designed to meet your unique operational and business needs.",
            category: "automation",
            detailPage: "services/custom-automations.html"
        }
    ];

    function createServiceCards() {
        const dataAnalysisGrid = document.getElementById('data-analysis-services-grid');
        const automationGrid = document.getElementById('automation-services-grid');

        if (dataAnalysisGrid) dataAnalysisGrid.innerHTML = '';
        if (automationGrid) automationGrid.innerHTML = '';

        myServices.forEach(service => {
            const serviceCard = document.createElement('div');
            serviceCard.classList.add('service-card');

            serviceCard.innerHTML = `
                <h4>${service.title}</h4>
                <p>${service.description}</p>
            `;

            if (service.category === 'data-analysis' && dataAnalysisGrid) {
                dataAnalysisGrid.appendChild(serviceCard);
            } else if (service.category === 'automation' && automationGrid) {
                automationGrid.appendChild(serviceCard);
            }
        });
    }

    // Only create service cards if on the index.html page
    if (location.pathname.includes('index.html') || location.pathname === '/') {
        createServiceCards();
    }

    // --- Image Enlargement Logic (for project detail pages) ---
    function setupImageEnlargement() {
        const projectImages = document.querySelectorAll('.project-detail-images img');
        if (projectImages.length === 0) return; // Exit if no images found

        projectImages.forEach(img => {
            img.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent click from bubbling to document/body

                // Create overlay
                const overlay = document.createElement('div');
                overlay.classList.add('image-overlay');
                document.body.appendChild(overlay);

                // Create enlarged image clone
                const enlargedImg = document.createElement('img');
                enlargedImg.src = img.src;
                enlargedImg.alt = img.alt;
                enlargedImg.classList.add('enlarged-image');
                overlay.appendChild(enlargedImg);

                // Activate the overlay and image for transition
                requestAnimationFrame(() => {
                    overlay.classList.add('active');
                });

                // Function to close the enlarged image
                const closeEnlargedImage = () => {
                    overlay.classList.remove('active');
                    // Remove elements after transition completes
                    overlay.addEventListener('transitionend', () => {
                        overlay.remove();
                    }, { once: true });
                };

                // Close when clicking on the overlay or the enlarged image itself
                overlay.addEventListener('click', closeEnlargedImage);
                enlargedImg.addEventListener('click', closeEnlargedImage); // Also close if clicking image directly

                // Close with Escape key
                const escapeHandler = (event) => {
                    if (event.key === 'Escape') {
                        closeEnlargedImage();
                        document.removeEventListener('keydown', escapeHandler); // Clean up listener
                    }
                };
                document.addEventListener('keydown', escapeHandler);
            });
        });
    }

    // Call image enlargement setup only on project detail pages
    if (location.pathname.includes('/projects/')) {
        setupImageEnlargement();
    }

    // --- Scroll-Triggered Animations Logic ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const observerOptions = {
        root: null, // relative to the viewport
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                // Stagger animation for children within the animated section
                Array.from(entry.target.children).forEach((child, index) => {
                    child.style.setProperty('--animation-delay', `${index * 0.1}s`);
                });
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // --- Project Card Click Effect and Navigation ---
    // This part is now within the `DOMContentLoaded` listener, and it queries
    // `.project-card` AFTER `createProjectCards()` has run, ensuring event listeners are attached.
    // This structure is correct for dynamically created elements.
    const setupProjectCardClickEffect = () => {
        const projectCardsForClickEffect = document.querySelectorAll('.project-card');

        projectCardsForClickEffect.forEach(card => {
            // Find the View Project button within THIS specific card
            const viewProjectButton = card.querySelector('.project-card-button');

            if (viewProjectButton) {
                viewProjectButton.addEventListener('click', function(event) {
                    event.preventDefault(); // Prevent immediate navigation

                    const targetUrl = this.href;

                    // 1. Add 'clicked' class to the parent card
                    card.classList.add('clicked');

                    // 2. Wait for the animation to complete then navigate
                    setTimeout(() => {
                        window.location.href = targetUrl;
                    }, 180); // A little longer than the CSS transition to ensure it plays fully
                });
            }
        });
    };

    // Call this after project cards are created (only on index.html)
    if (location.pathname.includes('index.html') || location.pathname === '/') {
        // Need to call this *after* `createProjectCards()` has run.
        // Since `createProjectCards()` is called directly, we can call this after its call.
        // Or, more robustly, call it after the initial filter (which implicitly shows all cards).
        // For current structure, calling it after `createProjectCards()` in the DOMContentLoaded block is fine.
        setupProjectCardClickEffect();
    }

}); // End of DOMContentLoaded