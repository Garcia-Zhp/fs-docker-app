package com.example.simple_api.service;

import java.util.List;
import java.util.Random;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.simple_api.entities.Quotes;
import com.example.simple_api.repository.QuotesRepository;

@Service
public class QuotesService {

    @Autowired
    private QuotesRepository quotesRepository;

    private final Random random = new Random(); // ✅ Added missing Random instance

    public String getRandomQuote() {
        // 1. Fetch all quotes from the database
        List<Quotes> quotesList = quotesRepository.findAll();

        // 2. Check for empty list
        if (quotesList.isEmpty()) {
            return "No quotes found in the database.";
        }

        // 3. Generate a random index
        int randomIndex = random.nextInt(quotesList.size());

        // 4. Select the random quote
        Quotes randomQuote = quotesList.get(randomIndex);

        // 5. Return the quote text
        return randomQuote.getQuoteText();
    }
}
