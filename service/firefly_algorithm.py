import json
import numpy as np
import pandas as pd
import sys
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.naive_bayes import GaussianNB

def random_float(min_val, max_val):
    return np.random.uniform(min_val, max_val)

def random_int(min_val, max_val):
    return np.random.randint(min_val, max_val)

def generate_random_genes(size):
    return np.random.randint(0, 2, size).tolist()

def extract_indices(genes):
    return [index for index, val in enumerate(genes) if val == 1]

def run_naive_bayes_cv(X, Y):
    nb = GaussianNB()
    scores = cross_val_score(nb, X, Y, cv=10)
    return np.mean(scores)

def run_firefly_algorithm(X, Y, nF=10, omega=0.9999, alpha=0.7, alphaCh=0.98, beta0=2, nItr=2, gamma=1, delta=0.05):
    D = X.shape[1]
    Y = np.array(Y)

    nbErrAll = run_naive_bayes_cv(X, Y)
    
    swarm = []

    for _ in range(nF):
        sGenes = generate_random_genes(D)
        innerGen = extract_indices(sGenes)
        selectedGenes = X[:, innerGen]
        nbErr = run_naive_bayes_cv(selectedGenes, Y)
        fitFunc = (1 - omega) * (len(innerGen) / D) + omega * (nbErr / nbErrAll)
        swarm.append({
            'sGenes': sGenes,
            'fitFunc': fitFunc,
            'nGen': len(innerGen),
            'Gen': innerGen,
            'FCost': nbErr,
            'innerGen': innerGen
        })
    
    bF = min(swarm, key=lambda x: x['fitFunc'])

    for itn in range(nItr):
        for i in range(nF):
            for j in range(nF):
                if swarm[j]['fitFunc'] < swarm[i]['fitFunc']:
                    eucDist = np.sqrt(np.sum((np.array(swarm[i]['sGenes']) - np.array(swarm[j]['sGenes'])) ** 2))
                    beta = beta0 * np.exp(-gamma * eucDist ** 2)
                    e = np.random.uniform(-delta, delta, D)
                    xTemp_genes = np.abs(np.tanh(np.array(swarm[i]['sGenes']) + beta * np.random.rand() * (np.array(swarm[j]['sGenes']) - np.array(swarm[i]['sGenes'])) + alpha * e))
                    xTemp_genes = (xTemp_genes > np.random.rand(D)).astype(int).tolist()
                    xTemp_innerGen = extract_indices(xTemp_genes)
                    xTemp_selectedGenes = X[:, xTemp_innerGen]

                    if xTemp_selectedGenes.size > 0:
                        nbErr = run_naive_bayes_cv(xTemp_selectedGenes, Y)
                        xTemp_fitFunc = (1 - omega) * (len(xTemp_innerGen) / D) + omega * (nbErr / nbErrAll)

                        if xTemp_fitFunc < swarm[i]['fitFunc']:
                            swarm[i] = {
                                'sGenes': xTemp_genes,
                                'fitFunc': xTemp_fitFunc,
                                'nGen': len(xTemp_innerGen),
                                'Gen': xTemp_innerGen,
                                'FCost': nbErr,
                                'innerGen': xTemp_innerGen
                            }
                            if xTemp_fitFunc < bF['fitFunc']:
                                bF = swarm[i]
        alpha *= alphaCh

    finalTrainSet = X[:, bF['innerGen']]

    errors = [run_naive_bayes_cv(finalTrainSet, Y) for _ in range(100)]
    avg_error = np.mean(errors)
    best_error = np.min(errors)

    result = {
        'best_fitness': bF['fitFunc'],
        'final_cost': bF['FCost'],
        'num_genes': bF['nGen'],
        'gene_subset': bF['Gen'],
        'avg_error': avg_error,
        'best_error': best_error
    }
    
    return result

def run_random_forest(X, Y):
    rf = RandomForestClassifier(n_estimators=100)
    X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.3)
    rf.fit(X_train, Y_train)
    importance = rf.feature_importances_
    return importance

def main():
    if len(sys.argv) < 2:
        raise ValueError("Please provide a dataset path as an argument.")

    dataset_path = sys.argv[1]

    try:
        df = pd.read_csv(dataset_path, sep=',')
    except pd.errors.ParserError as e:
        raise ValueError(f"Error parsing CSV file: {e}")

    X = df.iloc[:, :-1].values
    Y = df.iloc[:, -1].values

    importance = run_random_forest(X, Y)
    top_indices = np.argsort(importance)[::-1][:100]
    X = X[:, top_indices]

    result = run_firefly_algorithm(X, Y)
    print(json.dumps(result))

if __name__ == "__main__":
    main()
