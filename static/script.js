document.addEventListener('DOMContentLoaded', () => {
    const locationInput = document.getElementById('location-input');
    const generateBtn = document.getElementById('generate-btn');
    const btnSpinner = document.getElementById('btn-spinner');
    const btnText = generateBtn.querySelector('.btn-text');
    const resultContainer = document.getElementById('result-container');
    const displayLocation = document.getElementById('display-location');
    const shotListContent = document.getElementById('shot-list-content');
    const copyBtn = document.getElementById('copy-btn');

    let currentShotList = '';

    const setLoading = (loading) => {
        generateBtn.disabled = loading;
        btnSpinner.style.display = loading ? 'block' : 'none';
        btnText.style.display = loading ? 'none' : 'block';
    };

    const generateShotList = async () => {
        const location = locationInput.value.trim();
        if (!location) {
            alert('Please enter a location');
            return;
        }

        setLoading(true);
        resultContainer.style.display = 'none';

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ location }),
            });

            const data = await response.json();

            if (response.ok) {
                currentShotList = data.shot_list;
                displayLocation.textContent = location;
                shotListContent.innerHTML = marked.parse(data.shot_list);
                resultContainer.style.display = 'block';
                
                // Smooth scroll to result
                resultContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                throw new Error(data.detail || 'Failed to generate shot list');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    generateBtn.addEventListener('click', generateShotList);

    locationInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            generateShotList();
        }
    });

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(currentShotList).then(() => {
            const originalIcon = copyBtn.innerHTML;
            copyBtn.innerHTML = '<span style="font-size: 0.8rem; font-weight: bold; color: #4facfe;">Copied!</span>';
            setTimeout(() => {
                copyBtn.innerHTML = originalIcon;
            }, 2000);
        });
    });
});
