/* Intelligenza artificiale (sezione privata del pannello, dal 21/11/2026): elenco dei feed IA.
   Stesso lettore della rassegna (solo titoli, link e ora; nessun testo degli articoli), tabella separata ai_voci.
   Campi: id, nome, gruppo, lingua, urls (provati in ordine; Google News → Bing News se Google rifiuta).
   Gruppi: laboratori · fornitori · ricerca · regole · testate · italia · capitali · settori · societa.
   Nessun nome di cliente qui: il repository è pubblico. */
const g = (q, l = "en") => "https://news.google.com/rss/search?q=" + encodeURIComponent(q + " when:3d") + (l === "it" ? "&hl=it&gl=IT&ceid=IT:it" : "&hl=en-US&gl=US&ceid=US:en");
const F = (id, nome, gruppo, lingua, ...urls) => ({ id, nome, gruppo, lingua, urls });

export const AI_GRUPPI = { laboratori: "Laboratori", fornitori: "Fornitori e chip", ricerca: "Ricerca e misure", regole: "Regole e governi", testate: "Testate tech", italia: "Italia", capitali: "Capitali", settori: "Settori", societa: "Lavoro e società" };

export const AI_FONTI = [
  // laboratori
  F("openai", "OpenAI", "laboratori", "en", "https://openai.com/news/rss.xml", g("site:openai.com/index")),
  F("anthropic", "Anthropic", "laboratori", "en", g("site:anthropic.com/news")),
  F("deepmind", "Google DeepMind", "laboratori", "en", "https://deepmind.google/blog/rss.xml", g("site:deepmind.google")),
  F("google-ai", "Google · IA", "laboratori", "en", "https://blog.google/technology/ai/rss/"),
  F("meta-ai", "Meta AI", "laboratori", "en", g("site:ai.meta.com/blog")),
  F("mistral", "Mistral AI", "laboratori", "en", g("site:mistral.ai/news")),
  F("deepseek", "DeepSeek, Qwen, Moonshot", "laboratori", "en", g("DeepSeek OR Qwen OR Moonshot Kimi model")),
  F("xai", "xAI", "laboratori", "en", g("xAI Grok")),
  // fornitori e chip
  F("microsoft-ai", "Microsoft · IA", "fornitori", "en", "https://blogs.microsoft.com/ai/feed/"),
  F("aws-ml", "AWS · Machine Learning", "fornitori", "en", "https://aws.amazon.com/blogs/machine-learning/feed/"),
  F("nvidia", "Nvidia · comunicati", "fornitori", "en", "https://nvidianews.nvidia.com/releases.xml", g("site:nvidianews.nvidia.com")),
  F("chip", "Chip e semiconduttori", "fornitori", "en", g("AI chips TSMC OR Nvidia OR AMD OR Broadcom export")),
  F("huggingface", "Hugging Face", "fornitori", "en", "https://huggingface.co/blog/feed.xml"),
  // ricerca e misure
  F("arxiv-ai", "arXiv · cs.AI", "ricerca", "en", "https://rss.arxiv.org/rss/cs.AI"),
  F("epoch", "Epoch AI", "ricerca", "en", g("site:epoch.ai")),
  F("importai", "Import AI", "ricerca", "en", "https://importai.substack.com/feed", "https://jack-clark.net/feed/"),
  F("benchmark", "Benchmark indipendenti", "ricerca", "en", g("\"Artificial Analysis\" OR LMArena OR \"SWE-bench\" model")),
  // regole e governi
  F("ue-ai", "Commissione UE · IA", "regole", "en", g("site:digital-strategy.ec.europa.eu artificial intelligence")),
  F("aiact", "AI Act", "regole", "en", g("\"AI Act\" Commission OR \"AI Office\"")),
  F("usa-ai", "USA · politica IA", "regole", "en", g("White House OR Congress AI policy executive order")),
  F("cina-ai", "Cina · regole IA", "regole", "en", g("China AI regulation OR CAC generative AI")),
  F("garante", "Garante privacy · IA", "regole", "it", g("site:garanteprivacy.it intelligenza artificiale", "it")),
  F("acn-agid", "ACN e AgID", "regole", "it", g("ACN OR AgID intelligenza artificiale", "it")),
  // testate tech
  F("techcrunch", "TechCrunch · IA", "testate", "en", "https://techcrunch.com/category/artificial-intelligence/feed/"),
  F("verge", "The Verge · IA", "testate", "en", "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml"),
  F("ars", "Ars Technica · IA", "testate", "en", "https://arstechnica.com/ai/feed/"),
  F("techreview", "MIT Technology Review · IA", "testate", "en", "https://www.technologyreview.com/topic/artificial-intelligence/feed"),
  F("decoder", "The Decoder", "testate", "en", "https://the-decoder.com/feed/"),
  F("venturebeat", "VentureBeat · IA", "testate", "en", "https://venturebeat.com/category/ai/feed/"),
  F("reuters-tech", "Reuters · tecnologia", "testate", "en", g("site:reuters.com technology artificial intelligence")),
  F("ft-ai", "Financial Times · IA", "testate", "en", "https://www.ft.com/artificial-intelligence?format=rss"),
  F("scmp-tech", "SCMP · tecnologia", "testate", "en", "https://www.scmp.com/rss/36/feed"),
  F("restofworld", "Rest of World", "testate", "en", "https://restofworld.org/feed/latest"),
  F("sifted", "Sifted (Europa)", "testate", "en", "https://sifted.eu/feed", g("site:sifted.eu AI")),
  // Italia
  F("ansa-tech", "ANSA · tecnologia", "italia", "it", "https://www.ansa.it/sito/notizie/tecnologia/tecnologia_rss.xml"),
  F("sole-ia", "Il Sole 24 Ore · IA", "italia", "it", g("site:ilsole24ore.com intelligenza artificiale", "it")),
  F("agendadigitale", "Agenda Digitale", "italia", "it", "https://www.agendadigitale.eu/feed/"),
  F("ai4business", "AI4Business", "italia", "it", "https://www.ai4business.it/feed/"),
  F("wired-it", "Wired Italia", "italia", "it", "https://www.wired.it/feed/rss"),
  F("corcom", "CorCom", "italia", "it", "https://www.corrierecomunicazioni.it/feed/"),
  // capitali
  F("crunchbase", "Crunchbase News · IA", "capitali", "en", "https://news.crunchbase.com/sections/ai/feed/"),
  F("ia-conti", "Conti e investimenti IA", "capitali", "en", g("AI capex OR \"AI revenue\" earnings")),
  F("ia-round", "Round e quotazioni IA", "capitali", "en", g("AI startup raises OR IPO valuation")),
  // settori (moda e lusso, banche, sanità, industria)
  F("pambianco", "Pambianco", "settori", "it", "https://www.pambianconews.com/feed/"),
  F("fashionunited", "FashionUnited", "settori", "it", "https://fashionunited.it/rss-news", g("site:fashionunited.com AI")),
  F("bof", "Business of Fashion · IA", "settori", "en", g("site:businessoffashion.com AI")),
  F("lusso-ia", "Lusso e IA", "settori", "en", g("luxury brand artificial intelligence")),
  F("banche-ia", "Banche e IA", "settori", "en", g("bank generative AI deployment")),
  F("sanita-ia", "Sanità e IA", "settori", "en", g("hospital OR health system AI deployment")),
  // lavoro e società
  F("lavoro-ia", "Lavoro e IA", "societa", "en", g("AI jobs layoffs OR hiring OR workforce")),
  F("lavoro-ia-it", "Lavoro e IA · Italia", "societa", "it", g("intelligenza artificiale lavoro occupazione", "it")),
  F("pew", "Pew Research · tecnologia", "societa", "en", "https://www.pewresearch.org/internet/feed/", g("site:pewresearch.org artificial intelligence")),
  F("oecd-ai", "OCSE · IA", "societa", "en", g("site:oecd.org artificial intelligence")),
  F("scuola-ia", "Scuola, famiglie e IA", "societa", "en", g("AI students OR teenagers OR parents chatbot")),
];
