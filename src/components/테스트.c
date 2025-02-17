



#include <stdio.h>

void printMultiplicationTable(int type) {
    int i, j;
    if (type == 1) {  
        int odd[] = {3, 5, 7, 9};  
        for (i = 0; i < 4; i++) {  
            for (j = 1; j <= 9; j++) {
                printf("%d x %d = %d\n", odd[i], j, odd[i] * j);
            }
            printf("\n");
        }
    } else if (type == 2) {  
        int even[] = {2, 4, 6, 8};  
        for (i = 0; i < 4; i++) {  
            for (j = 1; j <= 9; j++) {
                printf("%d x %d = %d\n", even[i], j, even[i] * j);
            }
            printf("\n");
        }
    }
}

int main() {
    int input;
    
    // 사용자가 1 또는 2를 입력할 때까지 반복
    do {
        printf("홀수(1) 또는 짝수(2)를 입력하세요: ");
        scanf("%d", &input);
        
        if (input != 1 && input != 2) {
            printf("잘못된 입력입니다! 1 또는 2를 입력하세요.\n");
        }
    } while (input != 1 && input != 2);
    
    printMultiplicationTable(input);
    return 0;
}
