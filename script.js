function validateName() {
    const name = document.getElementById('fullName').value;
    const error = document.getElementById('fullNameError');
    if (name.length < 2) {
        error.style.display = 'block';
        return false;
    }
    error.style.display = 'none';
    return true;
}

function validateEmail() {
    const email = document.getElementById('email').value;
    const error = document.getElementById('emailError');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        error.style.display = 'block';
        return false;
    }
    error.style.display = 'none';
    return true;
}

function validatePhone() {
    const phone = document.getElementById('phone').value;
    const error = document.getElementById('phoneError');
    if (phone.length < 10) {
        error.style.display = 'block';
        return false;
    }
    error.style.display = 'none';
    return true;
}

function validatePosition() {
    const position = document.getElementById('position').value;
    const error = document.getElementById('positionError');
    if (!position) {
        error.style.display = 'block';
        return false;
    }
    error.style.display = 'none';
    return true;
}

function validateExperience() {
    const experience = document.getElementById('experience').value;
    const error = document.getElementById('experienceError');
    if (experience < 0 || experience > 50) {
        error.style.display = 'block';
        return false;
    }
    error.style.display = 'none';
    return true;
}

function validateCoverLetter() {
    const coverLetter = document.getElementById('coverLetter').value;
    const error = document.getElementById('coverLetterError');
    if (coverLetter.length < 10) {
        error.style.display = 'block';
        return false;
    }
    error.style.display = 'none';
    return true;
}

document.getElementById('jobForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const isValid = validateName() && validateEmail() && validatePhone() && 
                   validatePosition() && validateExperience() && validateCoverLetter();
    
    if (isValid) {
        document.getElementById('successMessage').style.display = 'block';
        this.style.display = 'none';
    }
});