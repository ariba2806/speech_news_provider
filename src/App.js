import React, { useState, useEffect } from 'react';
import { Typography } from '@material-ui/core';
import wordsToNumbers from 'words-to-numbers';
import alanBtn from '@alan-ai/alan-sdk-web';

import logo from './images/logo.png';
import { NewsCards} from './components';
import useStyles from './styles';

const App = () => {
  const [activeArticle, setActiveArticle] = useState(0);
  const [newsArticles, setNewsArticles] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const classes = useStyles();

  useEffect(() => {
    alanBtn({
      key: 'YOUR_ALAN_AI_API_KEY',
      onCommand: ({ command, articles, number }) => {
        if (command === 'newHeadlines') {
          setNewsArticles(articles);
          setActiveArticle(-1);
        } else if (command === 'instructions') {
          setIsOpen(true);
        } else if (command === 'highlight') {
          setActiveArticle((prevActiveArticle) => prevActiveArticle + 1);
        } else if (command === 'open') {
          const parsedNumber = number.length > 2 ? wordsToNumbers((number), { fuzzy: true }) : number;
          const article = articles[parsedNumber - 1];

          if (parsedNumber > articles.length) {
            alanBtn().playText('Please try that again...');
          } else if (article) {
            window.open(article.url, '_blank');
            alanBtn().playText('Opening...');
          } else {
            alanBtn().playText('Please try that again...');
          }
        }
      },
    });
  }, []);

  return (
    <div>
      <div className={classes.logoContainer}>
      <p style={{fontSize:'40px',fontWeight:'bold',marginBottom:'80px'}}>My <span style={{color:'purple'}}>NEWS READER </span>App</p>
        {newsArticles.length ? (
          <div className={classes.infoContainer}>
            <div style={{background:'#f5edf5',color:'black',boxShadow: '5px 10px 8px grey'}} className={classes.card}><Typography variant="h6" component="h2">Try saying: <br /><br />Open article number 4</Typography></div>
            <div style={{background:'#f5edf5',color:'black',boxShadow: '5px 10px 8px grey'}}  className={classes.card}><Typography variant="h6" component="h2">Try saying: <br /><br />Go back</Typography></div>
          </div>
        ) : null}
        
      </div>
      <NewsCards articles={newsArticles} activeArticle={activeArticle} />
    
      {!newsArticles.length ? (
        <div className={classes.footer}>
          <Typography variant="body1" component="h2" style={{fontSize:'30px'}}>
            Created by
            <a style={{fontSize:'30px'}} className={classes.link} href="https://www.linkedin.com/in"> Ariba Ahmed</a> 
            
          </Typography>
          <img className={classes.image} src={logo} height="60px" style={{borderRadius:'27px'}} alt="JSMastery logo" />
        </div>
      ) : null}
    </div>
  );
};

export default App;
