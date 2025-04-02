select *
from Product 
Where ProductID in (select ProductID
                    from History
                    where UserID=1);
