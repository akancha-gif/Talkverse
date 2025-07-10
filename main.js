// Mobile Navigation
const burger = document.querySelector('.burger');const navLinks = document.querySelector('.nav-links');burger.addEventListener('click', () => {navLinks.classList.toggle('active');burger.classList.toggle('toggle')});
// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        burger.classList.remove('toggle');
    });
});
// Language carousel
const carousel = document.querySelector('.carousel-container');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const slide = document.querySelector('.carousel-slide');
let counter = 0;
const size = document.querySelector('.language-preview').clientWidth;
nextBtn.addEventListener('click', () => {
    if (counter >= slide.children.length - 1) return;
    counter++;
    slide.style.transition = "transform 0.4s ease-in-out";
    slide.style.transform = 'translateX(' + (-size * counter) + 'px)';
});
prevBtn.addEventListener('click', () => {
    if (counter <= 0) return;
    counter--;
    slide.style.transition = "transform 0.4s ease-in-out";
    slide.style.transform = 'translateX(' + (-size * counter) + 'px)';
});
slide.addEventListener('transitionend', () => {
    if (slide.children[counter].id === 'last-clone') {
        slide.style.transition = "none";
        counter = slide.children.length - 2;
        slide.style.transform = 'translateX(' + (-size * counter) + 'px)';
    }
    if (slide.children[counter].id === 'first-clone') {
        slide.style.transition = "none";
        counter = slide.children.length - counter;
        slide.style.transform = 'translateX(' + (-size * counter) + 'px)';
    }
});
// Back to top button
const backToTopBtn = document.createElement('button');
backToTopBtn.innerHTML = '↑';
backToTopBtn.classList.add('back-to-top');
document.body.appendChild(backToTopBtn);
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopBtn.style.display = 'block';
    } else {
        backToTopBtn.style.display = 'none';
    }
});
backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
// JQuery for languges.html
class ProgressTracker {
    constructor() {
        this.progress = JSON.parse(localStorage.getItem('languageProgress')) || {};
    }
    updateProgress(language, lessonId, completed = true) {
        if (!this.progress[language]) {
            this.progress[language] = {
                completedLessons: [],
                totalLessons: 0
            };
        }
        if (completed && !this.progress[language].completedLessons.includes(lessonId)) {
            this.progress[language].completedLessons.push(lessonId);
            this.saveProgress();
        }
    }
    getProgress(language) {
        if (!this.progress[language]) return 0;
        const total = this.progress[language].totalLessons || 1;
        const completed = this.progress[language].completedLessons.length;
        return Math.round((completed / total) * 100);
    }
    saveProgress() {
        localStorage.setItem('languageProgress', JSON.stringify(this.progress));
    }
    renderProgressBars() {
        document.querySelectorAll('.language-progress').forEach(element => {
            const language = element.dataset.lang;
            const progress = this.getProgress(language);       
            element.innerHTML = `
                <div class="progress-container">
                    <div class="progress-bar" style="width: ${progress}%"></div>
                </div>
                <span>${progress}% complete</span>
            `;
        });
    }}
    // Search functionality
    $('.search-bar input').on('input', function() {
        const searchTerm = $(this).val().toLowerCase();  
        $('.language-card').each(function() {
            const languageName = $(this).find('h3').text().toLowerCase();
            if (languageName.includes(searchTerm)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });
    // Keyboard navigation for language cards
    $('.language-card').on('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            $(this).find('a').get(0).click();
        }
    });

// Update progress when a lesson is completed
document.addEventListener('DOMContentLoaded', () => {
    const completeButtons = document.querySelectorAll('.complete-lesson');
    completeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const lessonId = button.dataset.lessonId;
            const language = button.dataset.language;
            progressTracker.updateProgress(language, lessonId);
            progressTracker.renderProgressBars();
        });});
    // Render progress bars on page load
    progressTracker.renderProgressBars();
});
//Jquery for quizzes.html
document.addEventListener('DOMContentLoaded', function() {
    const quizContainer = document.getElementById('quiz');
    const resultsContainer = document.getElementById('results');
    const submitButton = document.getElementById('submit');
    
    const quizzes = {
        spanish: [
            {
                question: "What does 'hola' mean in English?",
                answers: {
                    a: "Hello",
                    b: "Goodbye",
                    c: "Thank you"
                },
                correctAnswer: "a"
            },
            {
                question: "How do you say 'good morning' in Spanish?",
                answers: {
                    a: "Buenas noches",
                    b: "Buenas tardes",
                    c: "Buenos días"
                },
                correctAnswer: "c"
            }
        ],
        french: [
            // French quiz questions
        ]
    };
    
    function buildQuiz(language) {
        const quizData = quizzes[language] || [];
        const output = [];
        
        quizData.forEach((currentQuestion, questionNumber) => {
            const answers = [];
            
            for (letter in currentQuestion.answers) {
                answers.push(
                    `<label>
                        <input type="radio" name="question${questionNumber}" value="${letter}">
                        ${letter}: ${currentQuestion.answers[letter]}
                    </label><br>`
                );
            }
            
            output.push(
                `<div class="question"> ${currentQuestion.question} </div>
                <div class="answers"> ${answers.join('')} </div>`
            );
        });
        
        quizContainer.innerHTML = output.join('');
    }
    
    function showResults(language) {
        const quizData = quizzes[language] || [];
        const answerContainers = quizContainer.querySelectorAll('.answers');
        let numCorrect = 0;
        
        quizData.forEach((currentQuestion, questionNumber) => {
            const answerContainer = answerContainers[questionNumber];
            const selector = `input[name=question${questionNumber}]:checked`;
            const userAnswer = (answerContainer.querySelector(selector) || {}).value;
            
            if (userAnswer === currentQuestion.correctAnswer) {
                numCorrect++;
                answerContainers[questionNumber].style.color = 'lightgreen';
            } else {
                answerContainers[questionNumber].style.color = 'red';
            }
        });
        
        resultsContainer.innerHTML = `${numCorrect} out of ${quizData.length}`;
    }
    
    // Get language from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const language = urlParams.get('lang') || 'spanish';
    
    buildQuiz(language);
    
    submitButton.addEventListener('click', () => {
        showResults(language);
    });
});
//login Jquery
$(document).ready(function () {
    // Toggle navbar links on burger click (for mobile)
    $('.burger').click(function () {
        $('.nav-links').slideToggle(300);
        $(this).toggleClass('toggle');
    });
    // Toggle password visibility
    $('.toggle-password').click(function () {
        const input = $(this).siblings('input');
        const icon = $(this).children('i');
        if (input.attr('type') === 'password') {
            input.attr('type', 'text');
            icon.removeClass('fa-eye').addClass('fa-eye-slash');
            $(this).attr('aria-label', 'Hide password');
        } else {
            input.attr('type', 'password');
            icon.removeClass('fa-eye-slash').addClass('fa-eye');
            $(this).attr('aria-label', 'Show password');
        }
    });
    // Basic form validation on submit
    $('#loginForm').submit(function (e) {
        e.preventDefault();
        let isValid = true;
        const email = $('#email').val().trim();
        const password = $('#password').val().trim();
        // Clear previous error messages
        $('.error-message').text('');
        // Email validation
        if (email === '') {
            $('#email-error').text('Please enter your email.');
            isValid = false;
        } else if (!validateEmail(email)) {
            $('#email-error').text('Please enter a valid email address.');
            isValid = false;
        }
        // Password validation
        if (password === '') {
            $('#password-error').text('Please enter your password.');
            isValid = false;
        } else if (password.length < 6) {
            $('#password-error').text('Password must be at least 6 characters.');
            isValid = false;
        }
        if (isValid) {
            // In a real app, submit form data to server here
            alert('Form submitted successfully!');
            // Optionally reset form
            // $(this).trigger('reset');
        }
    });
    // Email validation regex
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email.toLowerCase());
    }});

// lessons jquery
$(document).ready(function() {
    $('.lesson-nav-btn').on('click', function() {
        $('.lesson-nav-btn').removeClass('active');
        $(this).addClass('active');
        // In a real app, this would load different lesson categories
    });
    // Mark as complete button
    $('.pagination-btn:contains("Mark as Complete")').on('click', function() {
        $(this).text('Completed!').css('background-color', 'var(--secondary-color)');
        // In a real app, this would update progress in the database
    });
    // Media controls
    $('audio, video').on('play', function() {
        // Track media playback for analytics
        console.log('Media playback started:', $(this).attr('src'));
    });});
    // Level filtering
    $('.level-btn').on('click', function() {
        $('.level-btn').removeClass('active');
        $(this).addClass('active');
        // In a real app, this would filter lessons by level
    });
    // Start lesson button
    $('.start-btn').on('click', function() {
        const lessonTitle = $(this).closest('.lesson-card').find('h3').text();
        alert(`Starting lesson: ${lessonTitle}`);
        // In a real app, this would redirect to the lesson page
    });
//quiz jquery

//resources jquery
(document).ready(function() {
    // Tab functionality
    $('.tab-btn').on('click', function() {
        const tabId = $(this).data('tab');
        $('.tab-btn').removeClass('active');
        $(this).addClass('active');
        $('.tab-panel').removeClass('active');
        $(`#${tabId}`).addClass('active');
    });
    
    // Download button
    $('.download-btn').on('click', function(e) {
        e.preventDefault();
        const resourceName = $(this).closest('.resource-card').find('h3').text();
        alert(`Downloading: ${resourceName}`);
        // In a real app, this would trigger a file download
});});
