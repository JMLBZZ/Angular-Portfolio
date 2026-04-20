package com.portfolio.portfolio_backend.domain.port.out;

import java.util.List;

public interface TranslationPort {

    List<String> translateFrToEn(List<String> texts);
}