# Ziqi Wei , personal academic website ()

Static GitHub Pages prototype.

## Navigation

- `index.html` , About Me + research interests + profile links
- `publications.html` , manuscripts + presentations
- `research-experiences.html` , research experiences
- `photography.html` , photography portfolio placeholder
- `files/Ziqi_Wei_CV.pdf` , current public CV PDF

## Homepage profile links

- CV
- GitHub: https://github.com/alcohol-freeWhisky
- LinkedIn: https://www.linkedin.com/in/ziqi-wei-mit/
- ResearchGate: https://www.researchgate.net/profile/Ziqi-Wei-15
- Email: ziqiwei@mit.edu

Google Scholar and ORCID are intentionally omitted for now.

## Research Experiences order

1. Climate Negotiation Simulation , MIT SERC Scholar, 2026
2. Climate Uncertainty Propagation through Statistical Downscaling and Building Energy Models , Michigan / Tsinghua, 2025
3. Gaussian Process Regression for Predicting Precipitation with Periodic Oscillations and Reducing Uncertainty Over Time , Stanford, 2024
4. Renewable Resource Droughts and Power System Implications , Cornell, 2023–2024
5. Modeling and Promoting Express Packaging Reuse Behavior among Beijing Resident , Tsinghua, 2022–2023

## Local university PNG assets

All university marks used on the Research Experiences page are stored locally under `assets/logos/` so the layout does not depend on remote image hosts:

- `mit.png`
- `university-of-michigan.png`
- `tsinghua-university.png`
- `stanford-university.png`
- `cornell-university.png`

CSS gives every logo a fixed bounding box and `object-fit: contain` to prevent oversized source images from overflowing the research sidebar.

## Research resource links already included

### Climate Negotiation Simulation
- GitHub: https://github.com/alcohol-freeWhisky/climate_negotiation_simulation
- Poster: https://github.com/alcohol-freeWhisky/climate_negotiation_simulation/blob/main/poster.pdf
- MIT SERC Scholars Program: https://computing.mit.edu/cross-cutting/social-and-ethical-responsibilities-of-computing/serc-scholars-program/

### Stanford GPR project
- GitHub: https://github.com/alcohol-freeWhisky/GPR-Precipitation-with-Oscillations-2024summer
- Poster: https://github.com/alcohol-freeWhisky/GPR-Precipitation-with-Oscillations-2024summer/blob/main/poster.pdf

## Preview locally

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`.
