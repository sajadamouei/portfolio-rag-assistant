---
id: dry-eye-classification
title: Classifying Dry Eye Disease Patients from Healthy Controls Using Machine Learning and Metabolomics Data
source_type: research_project
language: en
research_status: completed
publication_status: published

show_as_project: true
show_as_publication: true

organization:
  - Simula Metropolitan Center for Digital Engineering
  - Oslo Metropolitan University

start_date:
end_date:
last_verified: 2026-08-05

publication_title: Classifying Dry Eye Disease Patients from Healthy Controls Using Machine Learning and Metabolomics Data
publication_venue: Diagnostics
publication_year: 2024
publication_date: 2024-11-29
publication_volume: 14
publication_issue: 23
article_number: 2696
doi: 10.3390/diagnostics14232696
paper_url: https://www.mdpi.com/2075-4418/14/23/2696
repository_url: https://github.com/sajadamouei/classification-metabolomics
portfolio_url: https://sajad.no/#projects
live_demo_url:

authors:
  - Sajad Amouei Sheshkal
  - Morten Gundersen
  - Michael Alexander Riegler
  - Øygunn Aass Utheim
  - Kjell Gunnar Gundersen
  - Helge Rootwelt
  - Katja Benedikte Prestø Elgstøen
  - Hugo Lewi Hammer
---

# # Classifying Dry Eye Disease Patients from Healthy Controls Using Machine Learning and Metabolomics Data

## Overview

This research investigated whether machine-learning models could distinguish cataract patients with dry eye disease from those without dry eye disease using tear-film metabolomics data.

The study compared several machine-learning approaches and examined which models were most suitable for a small, imbalanced and highly dimensional biological dataset.

## Research question

Can machine-learning models classify cataract patients with and without dry eye disease using metabolomic features extracted from tear-film samples?

A secondary question was whether combining metabolomics data produced in positive and negative ionization modes could improve model performance.

## Motivation

Dry eye disease is commonly diagnosed using clinical signs and patient-reported symptoms, but signs and symptoms do not always correspond closely.

Metabolomics provides molecular-level information that may help identify biological patterns associated with dry eye disease.

The study therefore explored whether machine learning could identify useful patterns in tear-film metabolomics data and determine which model was most suitable for this type of dataset.

## Dataset

The machine-learning experiments used anonymized tear-film metabolomics data from 81 cataract patients:

- 54 patients with dry eye disease
- 27 patients without dry eye disease

The samples were analyzed using two ionization modes:

- ESI+ dataset with 1,922 metabolomic features
- ESI− dataset with 939 metabolomic features

The two datasets were also combined using early-stage integration to create a merged feature set.

The clinical study, sample collection and metabolomics preparation were conducted in collaboration with clinical and biological experts.

## Challenge

The main challenge was obtaining reliable results from a dataset with:

- only 81 samples,
- an imbalanced class distribution,
- thousands of metabolomic features,
- and a high risk of overfitting.

Traditional accuracy could also provide a misleading picture because one class contained twice as many samples as the other.

The project therefore required a careful validation strategy and evaluation metrics designed for imbalanced classification.

## My contribution

I implemented and ran the machine-learning experimentation pipeline.

My work included:

- preparing the metabolomics data for machine-learning experiments,
- implementing and comparing the classification models,
- designing the nested stratified cross-validation workflow,
- performing hyperparameter tuning,
- evaluating the models using multiple imbalance-aware metrics,
- comparing results across the ESI+, ESI− and merged datasets,
- analyzing model consistency across cross-validation folds,
- and interpreting the most important features from the best-performing model.

The clinical data collection, tear-sample preparation, metabolomics analysis and biological interpretation were performed collaboratively with clinical and biological experts.

## Methods and solution

The study compared six supervised machine-learning models:

- Logistic Regression with L2 regularization
- XGBoost
- Random Forest
- Support Vector Machine
- Multilayer Perceptron
- k-Nearest Neighbors

Two dummy classifiers were also used as baselines:

- uniform random prediction
- most-frequent-class prediction

The metabolomics data were preprocessed through logarithmic transformation, standardization and quantile normalization.

The models were evaluated separately on:

1. the ESI+ dataset,
2. the ESI− dataset,
3. the merged ESI+ and ESI− dataset.

Hyperparameters were tuned using grid search inside a nested stratified cross-validation process.

## Architecture or workflow

Tear-film samples  
→ metabolomics analysis  
→ ESI+ and ESI− datasets  
→ preprocessing and normalization  
→ optional early integration of the datasets  
→ machine-learning model training  
→ nested stratified cross-validation  
→ hyperparameter selection  
→ performance evaluation  
→ model comparison and feature interpretation

## Technologies

- Python
- scikit-learn
- XGBoost
- Pandas
- NumPy
- SciPy
- Matplotlib
- Seaborn
- Google Colab
- Jupyter Notebook

## Hard parts

The hardest technical problem was preventing overfitting and obtaining a trustworthy comparison between models.

The number of features was much larger than the number of samples. Complex models could easily learn patterns specific to the training folds rather than patterns that generalized to unseen patients.

To address this problem, I used:

- stratified cross-validation to maintain the class distribution,
- nested cross-validation to separate hyperparameter tuning from final testing,
- a restricted hyperparameter search space,
- L2 regularization,
- multiple evaluation metrics,
- dummy classifiers as baselines,
- and performance comparisons across folds.

Another challenge was deciding how to evaluate an imbalanced medical dataset. Ordinary accuracy could favor the majority class, so several complementary metrics were required.

## Experimental design and validation

The outer evaluation used stratified 10-fold cross-validation.

Inside each outer training fold, stratified 5-fold cross-validation was used for hyperparameter tuning.

This produced the following process:

1. Split the dataset into ten stratified outer folds.
2. Hold one outer fold aside as the test set.
3. Use the remaining nine folds for training.
4. Run five-fold cross-validation inside the training data to select hyperparameters.
5. Retrain the model using the selected hyperparameters.
6. Evaluate it on the untouched outer test fold.
7. Repeat until every outer fold has been used as the test set.

The models were evaluated using:

- Area Under the ROC Curve
- Balanced Accuracy
- Matthews Correlation Coefficient
- Specificity
- F1-score

These metrics were selected because ordinary accuracy alone could be misleading for the imbalanced dataset.

## Results

Logistic regression with L2 regularization produced the best overall and most balanced performance on the merged ESI+ and ESI− dataset.

Its average results were:

- AUC: 0.8378
- Balanced Accuracy: 0.735
- Matthews Correlation Coefficient: 0.5147
- Specificity: 0.5667
- F1-score: 0.8513

Logistic regression achieved the highest AUC, balanced accuracy and MCC among the tested models on the merged dataset.

Random Forest achieved a slightly higher F1-score, but logistic regression demonstrated more balanced and consistent performance across the full set of metrics.

XGBoost and Random Forest performed well on some metrics, but their results were less consistent overall.

The merged ESI+ and ESI− dataset generally produced better and more balanced performance than using either ionization mode independently.

## Practical significance

The results demonstrate that tear-film metabolomics data contain patterns that machine-learning models can use to distinguish cataract patients with and without dry eye disease.

The research also showed that a relatively simple regularized model could outperform more complex models on a small, imbalanced and high-dimensional dataset.

The model was intended to support research into metabolomic signatures and potentially important features, not to serve as a clinical diagnostic system.

## Limitations

The main limitation was the small number of participants compared with the number of metabolomic features.

The dataset contained only 81 patients, which:

- increased the risk of overfitting,
- limited the reliability of complex models,
- and restricted the generalizability of the results.

The data were collected from a single clinic, so the findings may not generalize directly to other institutions, populations or sample-processing workflows.

There was no independent external dataset with comparable tear-film metabolomics characteristics for external validation.

The resulting models were not suitable for direct clinical deployment. Clinical decision systems would require larger datasets, external validation and stronger performance across measures such as sensitivity, specificity and precision.

## Trade-offs

Using nested cross-validation improved the reliability of model selection, but it increased computational cost and implementation complexity.

Merging ESI+ and ESI− features provided a more complete molecular representation, but it also increased dimensionality and the risk of overfitting.

Complex models could represent nonlinear relationships, but the small dataset made their behavior less stable.

Logistic regression was less flexible than ensemble or neural-network models, but L2 regularization made it more stable and suitable for the available data.

## Lessons learned

I learned that a more complex machine-learning model does not necessarily produce better results.

For a small, imbalanced and high-dimensional dataset, a simpler regularized model can be more stable and generalize better than more complex approaches.

I also learned that the evaluation strategy can be as important as the algorithm. Nested stratified cross-validation, careful hyperparameter tuning and multiple suitable metrics were necessary to avoid overly optimistic conclusions.

Finally, the research demonstrated the importance of collaboration between machine-learning specialists and biological experts. Machine-learning models can identify potentially important patterns, but those patterns must be interpreted and validated using domain knowledge.

## Future improvements

Future work should include:

- collecting a larger and more diverse patient dataset,
- validating the models using data from other clinics,
- testing external datasets when comparable tear-film metabolomics data become available,
- evaluating feature-selection methods inside the cross-validation process,
- exploring explainable-AI methods for identifying important metabolomic features,
- and biologically validating the most relevant candidate metabolites.