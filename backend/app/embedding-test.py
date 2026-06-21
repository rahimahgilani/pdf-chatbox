from sentence_transformers import SentenceTransformer

# Step 1: Loading the Model
model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

# Step 2: Defining a List of Sentences 
sentences1 = [
    "The weather is lovely today.",
    "It's so sunny outside!",
    "He drove to the stadium.",
    "I love cycling outside",
    "Reconnecting with nature brings me peace"
]

sentences2 = [
    "The dog plays in the garden",
    "The new movie is so great",
    "A woman watches TV",
    "Children usually don't like to go to school."
]

# 2. Calculate embeddings by calling model.encode()
embeddings1 = model.encode(sentences1)
print(embeddings1.shape)

embeddings2 = model.encode(sentences2)
print(embeddings2.shape)

# 3. Calculate the embedding similarities
# we compare two separate batches against each other
# sentences with sentences that make a 
# 5 x 5 grid since every sentence is compared with 
# every other sentence in the list 
similarities = model.similarity(embeddings1, embeddings2)
print(similarities)

# Later, in the actual chatbot, it'll look different — 
# you'll have group A = your stored PDF chunks, and 
# group B = just the one user question, so the shapes 
# won't even match (5 chunks vs 1 question, say)

# Output the pairs with their score
for idx_i, sentence1 in enumerate(sentences1):
    print(sentence1)
    for idx_j, sentence2 in enumerate(sentences2):
        print(f" - {sentence2: <30}: {similarities[idx_i][idx_j]:.4f}")